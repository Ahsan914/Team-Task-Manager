
import { Link, useNavigate } from "react-router";
import { LogOut, Users } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios.js";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  async function handleLogout() {
    try {
      await api.post("/auth/logout");

      localStorage.removeItem("user");
      toast.success("Logged out");
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not log out"
      );
    }
  }

  return (
    <header className="navbar border-b border-base-300 bg-base-100 px-4 sm:px-8">
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <Users size={22} />
          Team Tasks
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm sm:inline">
          {user.name}
        </span>

        <button
          onClick={handleLogout}
          className="btn btn-outline btn-sm"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
