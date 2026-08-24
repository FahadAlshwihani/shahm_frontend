import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppRouter from "./router/AppRouter";
import Login from "./pages/auth/Login";
import { useAuthStore } from "./store/useAuthStore";

jest.mock("./api/publicApi", () => {
  const response = () => Promise.resolve({ data: {} });
  return {
    getPublicHome: jest.fn(response),
    getPublicHeader: jest.fn(response),
    getPublicFooter: jest.fn(response),
    getPublicSettings: jest.fn(response),
  };
});

jest.mock("./components/layout/public/Footer", () => () => (
  <footer data-testid="public-footer" />
));

jest.mock("./components/common/WhatsAppFloat", () => () => (
  <div data-testid="whatsapp-float" />
));

beforeEach(() => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.setItem("shahm_language_selected", "true");
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
  });
});

test("application router renders the login route", () => {
  render(
    <MemoryRouter
      initialEntries={["/login"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppRouter />
    </MemoryRouter>
  );

  expect(screen.getByRole("heading")).toBeInTheDocument();
});

test("login page renders inside a router", () => {
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Login />
    </MemoryRouter>
  );

  expect(screen.getByPlaceholderText("login.email_ph")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("login.password_ph")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "login.submit" })).toBeInTheDocument();
});

test("application router renders the public home route", () => {
  render(
    <MemoryRouter
      initialEntries={["/"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppRouter />
    </MemoryRouter>
  );

  expect(screen.getByTestId("whatsapp-float")).toBeInTheDocument();
});

test("dashboard route redirects unauthenticated users to login", () => {
  render(
    <MemoryRouter
      initialEntries={["/dashboard"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AppRouter />
    </MemoryRouter>
  );

  expect(screen.getByPlaceholderText("login.email_ph")).toBeInTheDocument();
});
