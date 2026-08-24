import axiosClient from "./axiosClient";
import { useAuthStore } from "../store/useAuthStore";

describe("axiosClient authentication contract", () => {
  const requestHandler = axiosClient.interceptors.request.use.mock.calls[0][0];
  const responseErrorHandler = axiosClient.interceptors.response.use.mock.calls[0][1];

  afterEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  });

  test("adds the current bearer token and JSON content type", () => {
    useAuthStore.setState({ accessToken: "access-token", isAuthenticated: true });

    const config = requestHandler({ method: "get", url: "/protected", headers: {} });

    expect(config.headers.Authorization).toBe("Bearer access-token");
    expect(config.headers["Content-Type"]).toBe("application/json");
    expect(config.signal).toBeDefined();
  });

  test("does not send the bearer token to a cross-origin URL", () => {
    useAuthStore.setState({ accessToken: "access-token", isAuthenticated: true });

    const config = requestHandler({
      method: "get",
      url: "https://external.example/resource",
      headers: {},
    });

    expect(config.headers.Authorization).toBeUndefined();
  });

  test("does not force a multipart boundary for FormData", () => {
    const config = requestHandler({
      method: "post",
      url: "/upload",
      headers: { "Content-Type": "application/json" },
      data: new FormData(),
    });

    expect(config.headers["Content-Type"]).toBeUndefined();
  });

  test("logs out after an unauthorized response when no refresh token exists", async () => {
    useAuthStore.setState({ accessToken: "expired", isAuthenticated: true });
    localStorage.setItem("access_token", "expired");

    await expect(
      responseErrorHandler({
        config: { method: "get", url: "/protected", headers: {} },
        response: { status: 401 },
      })
    ).rejects.toBeDefined();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(localStorage.getItem("access_token")).toBeNull();
  });

  test("rejects requests queued behind a failed token refresh", async () => {
    useAuthStore.setState({
      accessToken: "expired",
      refreshToken: "invalid-refresh",
      isAuthenticated: true,
    });

    let rejectRefresh;
    axiosClient.post.mockImplementationOnce(
      () => new Promise((resolve, reject) => {
        rejectRefresh = reject;
      })
    );

    const firstRequest = responseErrorHandler({
      config: { method: "get", url: "/protected/one", headers: {} },
      response: { status: 401 },
    });
    const queuedRequest = responseErrorHandler({
      config: { method: "get", url: "/protected/two", headers: {} },
      response: { status: 401 },
    });

    const refreshFailure = new Error("refresh failed");
    rejectRefresh(refreshFailure);

    await expect(firstRequest).rejects.toBe(refreshFailure);
    await expect(
      Promise.race([
        queuedRequest.then(
          () => "resolved",
          () => "rejected"
        ),
        new Promise((resolve) => setTimeout(() => resolve("timed-out"), 25)),
      ])
    ).resolves.toBe("rejected");
  });
});
