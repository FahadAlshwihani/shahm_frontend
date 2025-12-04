import React, { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const ok = await login({ email, password });
    if (!ok) toast.error("خطأ في تسجيل الدخول");
  };

  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "40px auto" }}>
      <h2 style={{ marginBottom: "20px" }}>تسجيل الدخول</h2>

      <form onSubmit={submitHandler}>
        <div style={{ marginBottom: "15px" }}>
          <label>البريد الإلكتروني:</label>
          <input
            type="email"
            style={{ width: "100%", padding: "8px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>كلمة المرور:</label>
          <input
            type="password"
            style={{ width: "100%", padding: "8px" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
