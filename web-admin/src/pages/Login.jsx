import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await client.post("/api/auth/login", { phone, password });
      if (data.user.role !== "ADMIN") {
        setError("This account does not have admin access.");
        return;
      }
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">OnlyGDV Admin</h1>
        <p className="text-slate-500 text-sm mb-6">Sign in to manage the platform</p>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        <input
          className="w-full border rounded-md px-3 py-2 mb-3 text-sm"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="w-full border rounded-md px-3 py-2 mb-5 text-sm"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-slate-900 text-white rounded-md py-2 text-sm font-semibold">
          Log In
        </button>
        <p className="text-xs text-slate-400 mt-4">
          Admin accounts are created directly in the database — there's no public admin signup.
        </p>
      </form>
    </div>
  );
}
