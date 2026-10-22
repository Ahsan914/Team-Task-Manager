
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar.jsx";
import TeamCard from "../components/TeamCard.jsx";
import api from "../lib/axios.js";

export default function HomePage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  async function fetchTeams() {
    try {
      const response = await api.get("/teams");
      setTeams(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not load teams"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeams();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleCreateTeam(event) {
    event.preventDefault();

    try {
      const response = await api.post("/teams", form);

      setTeams((previous) => [
        response.data,
        ...previous
      ]);

      setForm({ name: "", description: "" });
      setShowForm(false);
      toast.success("Team created");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not create team"
      );
    }
  }

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Teams</h1>
            <p className="mt-1 text-sm text-gray-500">
              Organize your teams and track their tasks.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ Create team"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreateTeam}
            className="card mt-6 max-w-xl bg-base-100 shadow-sm"
          >
            <div className="card-body">
              <h2 className="text-xl font-semibold">
                Create a team
              </h2>

              <label className="form-label">Team name</label>
              <input
                className="input input-bordered w-full"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={100}
              />

              <label className="form-label">Description</label>
              <textarea
                className="textarea textarea-bordered w-full"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
              />

              <button className="btn btn-primary mt-2">
                Create
              </button>
            </div>
          </form>
        )}

        <section className="mt-8">
          {loading ? (
            <p>Loading teams...</p>
          ) : teams.length === 0 ? (
            <div className="empty-state">
              <h2 className="text-xl font-semibold">
                No teams yet
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Create your first team to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => (
                <TeamCard key={team._id} team={team} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
