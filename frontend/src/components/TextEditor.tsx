/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import { FaShare, FaTimes } from "react-icons/fa";
import { EditorDataModel } from "../config/EditorDataMode";
import axios from "../config/axios";

interface TextEditorProps {
  documentId: string | undefined;
  username: string | undefined;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

const TextEditor = ({ documentId, username, setUsername }: TextEditorProps) => {
  const [title, setTitle] = useState("Untitled Document");
  const [permission, setPermission] = useState("read");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUsername, setShareUsername] = useState("");
  const [shareAccess, setShareAccess] = useState("read");
  const [shareStatus, setShareStatus] = useState("");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<EditorDataModel | null>(null);
  const [userId, setUserId] = useState();
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await axios.get("/user/session");
      const data = response.data;

      setUserId(data.userId);
      setUsername(data.username);
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    console.log("Updated text:", text);
  }, [text]);

  useEffect(() => {
    if (userId && documentId) {
      console.log(
        "Initializing editor with userId:",
        userId,
        "and documentId:",
        documentId
      );
      setEditor(new EditorDataModel(userId, documentId));
    }
  }, [userId, documentId]); // Runs when both values are ready

  const fontInfo = { width: 8, height: 18 };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const key = e.key;
    console.log("Key pressed:", key);
    if (!editor) return;

    if (key.length == 1) editor.insertChar(key, editor.cursor_position);
    else if (key === "Enter") {
      editor.insertChar("\n", editor.cursor_position);
      console.log();
    } else if (key === "Backspace") {
      console.log("backspaced");
      editor.deleteChar(editor.cursor_position);
    } else if (key === "ArrowUp") {
      console.log("up");
    } else if (key === "ArrowDown") {
      console.log("down");
    } else if (key === "ArrowLeft") {
      console.log("left");
    } else if (key === "ArrowRight") {
      console.log("down");
    }

    // setText(editor.getText());
    setText(editor.getTextWithCursor(editor.cursor_position));
    console.log("cursor_position", editor.cursor_position);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!editor || !editorRef.current) return;
    const rect = editorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const position = editor.getPosition(x, y, fontInfo);
    console.log("current pos", position);
    editor.setCursorPosition(position);
    setText(editor.getTextWithCursor(editor.cursor_position));
  };

  return (
    <div
      className={`w-[90%] h-screen bg-gray-200 m-5 border flex flex-col rounded-lg shadow-md relative`}
    >
      {/* Navbar with original touch + hover effects */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-t-lg border-b">
        <div>
          <ul className="flex gap-4 text-sm font-normal">
            <li className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors duration-150">
              File
            </li>
            <li className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors duration-150">
              Edit
            </li>
            <li className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors duration-150">
              View
            </li>
            <li className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors duration-150">
              Insert
            </li>
            <li className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors duration-150">
              Format
            </li>
            <li className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors duration-150">
              Tools
            </li>
            <li className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors duration-150">
              Extensions
            </li>
            <li className="px-2 py-1 rounded hover:bg-gray-200 cursor-pointer transition-colors duration-150">
              Help
            </li>
          </ul>
        </div>
        {permission === "admin" && (
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-3 py-1 border rounded-md bg-white hover:bg-gray-50 transition-colors duration-150"
          >
            <FaShare size={16} />
            Share
          </button>
        )}
      </div>

      {/* Text Editor with improved styling */}
      <div
        ref={editorRef}
        contentEditable={true}
        suppressContentEditableWarning
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        // className={`w-full h-full overflow-x-hidden min-h-64 p-6 caret-transparent bg-[#FEFDF8] border-gray-300 text-gray-900 text-base focus:outline-none overflow-auto ${
        //   permission === "read" ? "cursor-default bg-gray-50" : ""
        // }`}
        className={`w-full h-full overflow-x-hidden min-h-64 p-3 caret-transparent bg-[#FEFDF8] border-gray-300 text-gray-900 text-base focus:outline-none overflow-auto cursor-default  `}
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "system-ui, -apple-system, sans-serif",
          lineHeight: `${fontInfo.height}px`,
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      />

      {/* {permission === "read" && (
        <div className="absolute bottom-4 right-4 bg-yellow-100 px-3 py-1 rounded-md text-sm">
          Read-only mode
        </div>
      )} */}

      {/* Custom Dialog implementation */}
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
                  placeholder="username"
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
                  <option value="admin">Admin</option>
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
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          .cursor.blink {
            border-left: 2px solid black;
            display: inline;
            animation: blink 1s step-end infinite;
          }
        `}
    </style>
    </div>
  );
};

export default TextEditor;
