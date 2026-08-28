import { act } from "@testing-library/react";

import { useAuthStore } from "./useAuthStore";

describe("useAuthStore", () => {
  afterEach(() => {
    localStorage.clear();
    act(() =>
      useAuthStore.setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      })
    );
  });

  test("signing out clears both tokens and the session", () => {
    localStorage.setItem("access_token", "a");
    localStorage.setItem("refresh_token", "r");
    act(() => useAuthStore.setState({ accessToken: "a", refreshToken: "r", isAuthenticated: true }));

    act(() => useAuthStore.getState().logout());

    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("refresh_token")).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  test("sitting still does not end the session", () => {
    // The dashboard used to sign an editor out after ten idle minutes, which
    // is shorter than the time it takes to write one page of content.
    jest.useFakeTimers();

    act(() => useAuthStore.setState({ accessToken: "a", isAuthenticated: true }));
    act(() => jest.advanceTimersByTime(60 * 60 * 1000));

    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    jest.useRealTimers();
  });
});
