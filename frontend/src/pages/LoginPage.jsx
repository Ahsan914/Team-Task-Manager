
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form onSubmit={handleSubmit} className="card auth-card">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-gray-500">
          Log in to manage your teams and tasks.
        </p>

        <label className="form-label">Email</label>
        <input
          className="input input-bordered w-full"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label className="form-label">Password</label>
        <input
          className="input input-bordered w-full"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          className="btn btn-primary mt-2 w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="link link-primary">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
