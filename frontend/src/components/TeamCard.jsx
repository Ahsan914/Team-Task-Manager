
import { Link } from "react-router";
import { Users, ArrowRight } from "lucide-react";

export default function TeamCard({ team }) {
  return (
    <article className="card bg-base-100 shadow-sm border border-base-300">
      <div className="card-body gap-3">
        <h2 className="card-title">{team.name}</h2>

        <p className="text-sm text-gray-500">
          {team.description || "No description provided."}
        </p>

        <div className="flex items-center gap-2 text-sm">
          <Users size={16} />
          {team.members?.length || 0} members
        </div>

        <p className="text-sm text-gray-500">
          Created by: {team.creator?.name || "Unknown"}
        </p>

        <div className="card-actions mt-2">
          <Link
            to={`/team/${team._id}`}
            className="btn btn-primary btn-sm"
          >
            Open team <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
