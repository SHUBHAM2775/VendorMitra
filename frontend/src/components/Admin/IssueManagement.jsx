import React from "react";
import { FaEdit } from "react-icons/fa";

const IssueManagement = ({
  issues,
  handleUpdateIssueStatus
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Issues</h2>
      
      {/* Issue Status Tabs */}
      <div className="flex gap-4 mb-4">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              issues.some(i => i.status === status)
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({issues.filter(i => i.status === status).length})
          </button>
        ))}
      </div>

      {issues.map((issue) => (
        <div key={issue.id} className={`border-l-4 p-4 rounded mb-4 ${
          issue.status === "pending" ? "border-yellow-400 bg-yellow-50" :
          issue.status === "approved" ? "border-green-400 bg-green-50" :
          "border-red-400 bg-red-50"
        }`}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-semibold">{issue.subject}</div>
                <span className={`px-2 py-1 rounded text-xs ${
                  issue.priority === "high" ? "bg-red-100 text-red-700" :
                  issue.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {issue.priority}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${
                  issue.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  issue.status === "approved" ? "bg-green-100 text-green-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {issue.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-1">{issue.user} · {issue.email}</div>
              <div className="text-sm text-gray-700 mb-2">{issue.description}</div>
              <div className="text-xs text-gray-400">Submitted: {issue.submittedDate}</div>
            </div>
            <div className="flex gap-2 ml-4">
              {issue.status === "pending" && (
                <>
                  <button
                    className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 text-sm"
                    onClick={() => handleUpdateIssueStatus(issue.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-sm"
                    onClick={() => handleUpdateIssueStatus(issue.id, "rejected")}
                  >
                    Reject
                  </button>
                </>
              )}
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <FaEdit />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IssueManagement; 