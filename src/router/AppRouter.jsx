import { Routes } from "react-router-dom";
import PublicRoutes    from "./PublicRoutes";
import AuthRoutes      from "./AuthRoutes";
import DashboardRoutes from "./DashboardRoutes";

export default function AppRouter() {
  return (
    <Routes>
      {/* ---------------- Public ---------------- */}
      {PublicRoutes()}

      {/* ---------------- Auth ---------------- */}
      {AuthRoutes()}

      {/* ---------------- Dashboard (protected) ---------------- */}
      {DashboardRoutes()}
    </Routes>
  );
}