
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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
      const response = await api.post("/auth/signup", form);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      toast.success("Account created");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <form onSubmit={handleSubmit} className="card auth-card">
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-gray-500">
          Create an account to get started.
        </p>

        <label className="form-label">Name</label>
        <input
          className="input input-bordered w-full"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

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
          minLength={6}
        />

        <button
          className="btn btn-primary mt-2 w-full"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-center text-sm">
          Already registered?{" "}
          <Link to="/login" className="link link-primary">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
