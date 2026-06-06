import { Route } from "react-router-dom";
import Login from "../pages/auth/Login";

export default function AuthRoutes() {
  return (
    <>
      {/* ---------------- Auth ---------------- */}
      <Route path="/login" element={<Login />} />
    </>
  );
}