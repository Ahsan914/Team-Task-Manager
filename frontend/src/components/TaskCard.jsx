
import { Trash2 } from "lucide-react";

const statuses = [
  { value: "todo", label: "To do" },
  { value: "in-progress", label: "In progress" },
  { value: "completed", label: "Completed" }
];

export default function TaskCard({
  task,
  canManage,
  onStatusChange,
  onDelete
}) {
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="card-title text-lg">{task.name}</h3>

          {canManage && (
            <button
              className="btn btn-ghost btn-sm text-error"
              title="Delete task"
              onClick={() => onDelete(task._id)}
            >
              <Trash2 size={17} />
            </button>
          )}
        </div>

        <p className="text-sm text-gray-500">
          {task.description || "No description."}
        </p>

        <p className="text-sm">
          <strong>Due:</strong> {dueDate}
        </p>

        <div className="text-sm">
          <strong>Assigned to:</strong>

          {task.assignedTo?.length ? (
            <ul className="mt-1 list-inside list-disc">
              {task.assignedTo.map((member) => (
                <li key={member._id}>
                  {member.name || member.email || member._id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-gray-500">Unassigned</p>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span className="badge badge-outline">
            {statuses.find((item) => item.value === task.status)?.label
              || task.status}
          </span>

          {canManage && (
            <select
              className="select select-bordered select-sm"
              value={task.status}
              onChange={(event) =>
                onStatusChange(task._id, event.target.value)
              }
              aria-label={`Change status of ${task.name}`}
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </article>
  );
}
