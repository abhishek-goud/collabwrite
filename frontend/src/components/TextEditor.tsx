/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";

import { FaShare, FaTimes } from "react-icons/fa";

const TextEditor = () => {
  const [title, setTitle] = useState("Untitled Document");
  const [permission, setPermission] = useState("read");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUsername, setShareUsername] = useState("");
  const [shareAccess, setShareAccess] = useState("read");
  const [shareStatus, setShareStatus] = useState("");

  const fontInfo = { width: 8, height: 18 };

  return (
    <div
      className={`w-[90%] h-screen m-5 border flex flex-col rounded-lg shadow-md relative`}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-t-lg border-b">
        <div>
          <ul className="flex gap-4 text-sm font-normal">
            <li>File</li>
            <li>Edit</li>
            <li>View</li>
            <li>Insert</li>
            <li>Format</li>
            <li>Tools</li>
            <li>Extensions</li>
            <li>Help</li>
          </ul>
        </div>
        {permission === "admin" && (
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-3 py-1 border rounded-md bg-white hover:bg-gray-50"
          >
            <FaShare size={16} />
            Share
          </button>
        )}
      </div>
      <div
        className={`w-full h-full overflow-x-hidden min-h-64 p-5 bg-white border-gray-300 font-mono text-base focus:outline-none overflow-auto caret-transparent ${
          permission === "read" ? "cursor-default bg-gray-50" : ""
        }`}
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: `${fontInfo.height}px`,
        }}
      />

      {isShareDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Share Document</h3>
              <button
                onClick={() => setIsShareDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  value={shareUsername}
                  onChange={(e) => setShareUsername(e.target.value)}
                  placeholder="Enter username to share with"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="permission" className="text-sm font-medium">
                  Permission
                </label>
                <select
                  value={shareAccess}
                  onChange={(e) => setShareAccess(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="read">Read (View only)</option>
                  <option value="write">Write (Can edit)</option>
                  <option value="admin">Admin (Full control)</option>
                </select>
              </div>

              {shareStatus && (
                <div
                  className={`text-sm ${
                    shareStatus.includes("Error")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {shareStatus}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsShareDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {}}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
};

export default TextEditor;
