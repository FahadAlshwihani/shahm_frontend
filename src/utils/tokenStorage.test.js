import {
  clearTokens,
  readAccessToken,
  readRefreshToken,
  saveAccessToken,
  saveTokens,
} from "./tokenStorage";

describe("tokenStorage", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  test("stores and reads both tokens under the established keys", () => {
    saveTokens({ access: "access-value", refresh: "refresh-value" });

    expect(localStorage.getItem("access_token")).toBe("access-value");
    expect(localStorage.getItem("refresh_token")).toBe("refresh-value");
    expect(readAccessToken()).toBe("access-value");
    expect(readRefreshToken()).toBe("refresh-value");
  });

  test("refreshing replaces only the access token", () => {
    saveTokens({ access: "first", refresh: "refresh-value" });
    saveAccessToken("second");

    expect(readAccessToken()).toBe("second");
    expect(readRefreshToken()).toBe("refresh-value");
  });

  test("clearing removes both tokens", () => {
    saveTokens({ access: "access-value", refresh: "refresh-value" });
    clearTokens();

    expect(readAccessToken()).toBeNull();
    expect(readRefreshToken()).toBeNull();
  });

  test("a browser that refuses storage does not break the session", () => {
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage disabled");
    });

    expect(() => saveTokens({ access: "a", refresh: "b" })).not.toThrow();
    expect(readAccessToken()).toBeNull();
  });
});
