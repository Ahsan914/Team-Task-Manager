
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import Navbar from "../components/Navbar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import api from "../lib/axios.js";

export default function TeamPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [memberIds, setMemberIds] = useState("");

  const [taskForm, setTaskForm] = useState({
    name: "",
    description: "",
    dueDate: "",
    assignedTo: [],
    status: "todo"
  });

  const [teamForm, setTeamForm] = useState({
    name: "",
    description: ""
  });

  const isCreator =
    team?.creator?._id === user.id ||
    team?.creator?._id === user._id ||
    team?.creator === user.id;

  async function loadTeam() {
    try {
      const [teamResponse, membersResponse, tasksResponse] =
        await Promise.all([
          api.get(`/teams/${teamId}`),
          api.get(`/teams/${teamId}/members`),
          api.get(`/teams/${teamId}/tasks`)
        ]);

      setTeam(teamResponse.data);
      setMembers(membersResponse.data);
      setTasks(tasksResponse.data);

      setTeamForm({
        name: teamResponse.data.name,
        description: teamResponse.data.description || ""
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not load team"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  function handleTaskChange(event) {
    setTaskForm({
      ...taskForm,
      [event.target.name]: event.target.value
    });
  }

  async function handleCreateTask(event) {
    event.preventDefault();

    try {
      const payload = {
        ...taskForm,
        dueDate: taskForm.dueDate || null
      };

      const response = await api.post(
        `/teams/${teamId}/tasks`,
        payload
      );

      // Reload so populated member names are available.
      await loadTeam();

      setTaskForm({
        name: "",
        description: "",
        dueDate: "",
        assignedTo: [],
        status: "todo"
      });

      setShowTaskForm(false);
      toast.success("Task created");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not create task"
      );
    }
  }

  async function handleStatusChange(taskId, status) {
    try {
      await api.put(
        `/teams/${teamId}/tasks/${taskId}`,
        { status }
      );

      setTasks((previous) =>
        previous.map((task) =>
          task._id === taskId
            ? { ...task, status }
            : task
        )
      );

      toast.success("Task status updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not update task status"
      );
    }
  }

  async function handleDeleteTask(taskId) {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(
        `/teams/${teamId}/tasks/${taskId}`
      );

      setTasks((previous) =>
        previous.filter((task) => task._id !== taskId)
      );

      toast.success("Task deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not delete task"
      );
    }
  }

  async function handleAddMembers(event) {
    event.preventDefault();

    const userIds = [
      ...new Set(
        memberIds
          .split(/[\s,]+/)
          .map((id) => id.trim())
          .filter(Boolean)
      )
    ];

    if (!userIds.length) {
      toast.error("Enter at least one user ID");
      return;
    }

    try {
      await api.post(`/teams/${teamId}/members`, {
        userIds
      });

      setMemberIds("");
      await loadTeam();
      toast.success("Members added");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not add members"
      );
    }
  }

  async function handleUpdateTeam(event) {
    event.preventDefault();

    try {
      await api.put(`/teams/${teamId}`, teamForm);

      await loadTeam();
      toast.success("Team updated");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not update team"
      );
    }
  }

  async function handleDeleteTeam() {
    if (
      !window.confirm(
        "Delete this team and all its tasks?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/teams/${teamId}`);

      toast.success("Team deleted");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not delete team"
      );
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-container">Loading team...</main>
      </>
    );
  }

  if (!team) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <p>Team not found or could not be loaded.</p>
          <Link to="/" className="btn btn-primary mt-4">
            Back to teams
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page-container">
        <Link to="/" className="btn btn-ghost btn-sm mb-5">
          <ArrowLeft size={16} />
          Back to teams
        </Link>

        <section className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{team.name}</h1>
            <p className="mt-2 text-gray-500">
              {team.description || "No description provided."}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Created by {team.creator?.name || "Unknown"}
            </p>
          </div>

          {isCreator && (
            <button
              onClick={handleDeleteTeam}
              className="btn btn-outline btn-error btn-sm"
            >
              <Trash2 size={16} />
              Delete team
            </button>
          )}
        </section>

        {isCreator && (
          <section className="card mt-6 max-w-2xl border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body">
              <h2 className="text-lg font-semibold">
                Edit team
              </h2>

              <form
                onSubmit={handleUpdateTeam}
                className="flex flex-col gap-3"
              >
                <input
                  className="input input-bordered w-full"
                  value={teamForm.name}
                  onChange={(event) =>
                    setTeamForm({
                      ...teamForm,
                      name: event.target.value
                    })
                  }
                  required
                  maxLength={100}
                  aria-label="Team name"
                />

                <textarea
                  className="textarea textarea-bordered w-full"
                  value={teamForm.description}
                  onChange={(event) =>
                    setTeamForm({
                      ...teamForm,
                      description: event.target.value
                    })
                  }
                  placeholder="Team description"
                />

                <button className="btn btn-outline btn-sm self-start">
                  Save changes
                </button>
              </form>
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">
              Members ({members.length})
            </h2>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div
                key={member._id}
                className="rounded-lg border border-base-300 bg-base-100 p-4"
              >
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">
                  {member.email}
                </p>
              </div>
            ))}

            {members.length === 0 && (
              <p className="text-sm text-gray-500">
                No members have been added yet.
              </p>
            )}
          </div>

          {isCreator && (
            <form
              onSubmit={handleAddMembers}
              className="card mt-4 max-w-xl border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body gap-3">
                <h3 className="font-semibold">Add members</h3>

                <p className="text-sm text-gray-500">
                  Enter existing user IDs, separated by commas
                  or spaces.
                </p>

                <textarea
                  className="textarea textarea-bordered w-full"
                  value={memberIds}
                  onChange={(event) =>
                    setMemberIds(event.target.value)
                  }
                  placeholder="MongoDB user IDs"
                  required
                />

                <button className="btn btn-outline btn-sm self-start">
                  Add members
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Tasks</h2>
              <p className="mt-1 text-sm text-gray-500">
                {tasks.length} total tasks
              </p>
            </div>

            {isCreator && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowTaskForm(!showTaskForm)}
              >
                <Plus size={16} />
                {showTaskForm ? "Cancel" : "Create task"}
              </button>
            )}
          </div>

          {showTaskForm && isCreator && (
            <form
              onSubmit={handleCreateTask}
              className="card mt-5 max-w-2xl border border-base-300 bg-base-100 shadow-sm"
            >
              <div className="card-body gap-3">
                <h3 className="text-lg font-semibold">
                  New task
                </h3>

                <label className="form-label">Task name</label>
                <input
                  className="input input-bordered w-full"
                  name="name"
                  value={taskForm.name}
                  onChange={handleTaskChange}
                  required
                  maxLength={100}
                />

                <label className="form-label">Description</label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  name="description"
                  value={taskForm.description}
                  onChange={handleTaskChange}
                />

                <label className="form-label">Due date</label>
                <input
                  className="input input-bordered w-full"
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(event) =>
                    setTaskForm({
                      ...taskForm,
                      dueDate: event.target.value
                    })
                  }
                />

                <label className="form-label">Assign members</label>
                {members.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Add team members before assigning tasks.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {members.map((member) => (
                      <label
                        key={member._id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={taskForm.assignedTo.includes(
                            member._id
                          )}
                          onChange={(event) => {
                            const assignedTo = event.target.checked
                              ? [
                                  ...taskForm.assignedTo,
                                  member._id
                                ]
                              : taskForm.assignedTo.filter(
                                  (id) => id !== member._id
                                );

                            setTaskForm({
                              ...taskForm,
                              assignedTo
                            });
                          }}
                        />
                        <span className="text-sm">
                          {member.name} ({member.email})
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <label className="form-label">Initial status</label>
                <select
                  className="select select-bordered w-full"
                  name="status"
                  value={taskForm.status}
                  onChange={handleTaskChange}
                >
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>

                <button className="btn btn-primary mt-2">
                  Create task
                </button>
              </div>
            </form>
          )}

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                canManage={isCreator}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="empty-state mt-5">
              <p className="font-medium">No tasks yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Tasks created for this team will appear here.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
