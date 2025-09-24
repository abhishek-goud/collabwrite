/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
import { io, Socket } from "socket.io-client";

import colors from "../constants/colors"

interface TextEditorProps {
  documentId: string | undefined;
  username: string | undefined;
  title: string | "";
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
}

interface operation {
  type: "insert" | "delete";
  userId: string;
  char?: string;
  position: number;
  documentId: string;
}

export interface cursorInfo{
  position: number,
  username: string,
  userId: string,
  color: string,
  documentId: string

}

const TextEditor = ({
  documentId,
  username,
  setUsername,
  title,
  setTitle,
  setShowLoader,
}: TextEditorProps) => {
  // const [title, setTitle] = useState("Untitled Document");
  const [permission, setPermission] = useState("read");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUsername, setShareUsername] = useState("");
  const [shareAccess, setShareAccess] = useState("read");
  const [shareStatus, setShareStatus] = useState("");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<EditorDataModel | null>(null);
  const [userId, setUserId] = useState();
  const [docText, setDocText] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const [cursors, setCursors] =  useState<cursorInfo[]>([]);
  // const [loading, setLoading] = useState(true)

  const fetchDocument = async () => {
    const res = await axios.get(`/doc/${documentId}`);
    console.log("fetched doc", res.data);
    setTitle(res.data.title);
    setPermission(res.data.permission);
    editor?.setText(res.data.content);
    setDocText(editor?.getTextWithCursors(cursors) || "");
  };

  const handleShare = async () => {
    try {
      const res = await axios.put(`/doc/share/${documentId}`, {
        shareUsername,
        shareAccess,
      });
      if (res.status != 200) {
        setShareStatus(`Error sharing document with ${shareUsername}`);
        return;
      }

      setShareStatus(`Document successfully shared with ${shareUsername}`);
    } catch (err) {
      setShareStatus(`Error sharing document with ${shareUsername}`);
      console.log("error sharing document");
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/user/session");
        const data = response.data;

        setUserId(data.userId);
        setUsername(data.username);
      } catch (err) {
        console.log("Error fetching user details");
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const updateDocument = async () => {
      if (editor) {
        try {
          const res = await axios.put(`/doc/${documentId}`, {
            content: editor?.getText(),
          });
          // setShowLoader(false);
          console.log("doc updated", res.data);
        } catch (error) {
          console.error("Error updating document:", error);
        }
      }
    };

    updateDocument();
  }, [docText]);

  useEffect(() => {
    const updateDocument = async () => {
      if (editor) {
        try {
          setShowLoader(true);
          const res = await axios.put(`/doc/${documentId}`, {
            title: title || "Untitled Document",
          });
          setShowLoader(false);
          console.log("doc updated", res.data);
        } catch (error) {
          console.error("Error updating document:", error);
          setShowLoader(false);
        }
      }
    };

    updateDocument();
  }, [title]);

  useEffect(() => {
    if (userId && documentId) {
      setEditor(new EditorDataModel(userId, documentId));
    }
  }, [userId, documentId]); // Runs when both values are ready

  useEffect(() => {
    if (!editor) return;

    const initializeSocket = async () => {
      try {
        socketRef.current = io(import.meta.env.VITE_API_URL);
        setupSocketHandlers();
        await fetchDocument();
      } catch (err) {
        console.log(
          "error fetching document or establishing socket connection"
        );
      }
    };

    const setupSocketHandlers = () => {
     
      const socket = socketRef.current;

      socket?.on("connect", () => {
        const color = colors[Math.floor(Math.random() * colors.length)]
        socket.emit("join-document", { documentId, userId, username, color });
        console.log("connected to socket server");
      });


      socket?.on("document-state", (data: {content: string, title: string, cursors: cursorInfo[]}) => {
        editor.setText(data.content)
        setTitle(title)
        setCursors(cursors)
        setDocText(editor.getTextWithCursors(cursors));
      })

      socket?.on("text-operation", (data: operation) => {
        // console.log("event recieved");
        // console.log({ data });

        if (data.type === "insert") {
          editor.insertChar(data?.char || "", data.position, true);
        } else if (data.type === "delete") {
          editor.deleteChar(data.position, true);
        }
        setDocText(editor.getTextWithCursors(cursors));
      });

      socket?.on("cursor-update", (cursors: cursorInfo[]) => {
          setCursors(cursors.filter((cursor) => userId !== cursor.userId))
          setDocText(editor.getTextWithCursors(cursors));
      })
    };

    initializeSocket();
  }, [editor]);


  useEffect(() => {
    if(!editor) return
    setDocText(editor.getTextWithCursors(cursors))
  }, [editor?.cursor_position, cursors])

  const fontInfo = { width: 8, height: 18 };
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!editor) return;
    e.preventDefault();
    const key = e.key;
    console.log("Key pressed:", key);

    const currPosition = editor.cursor_position;
    switch (key) {
      case "Enter":
        editor.insertChar("\n", editor.cursor_position);
        socketRef.current?.emit("text-operation", {
          type: "insert",
          userId,
          char: "\n",
          documentId,
          position: currPosition,
        });
        break;

      case "Backspace":
        console.log("backspaced");
        editor.deleteChar(editor.cursor_position);
        socketRef.current?.emit("text-operation", {
          type: "delete", // likely delete instead of insert "\n"
          userId,
          documentId,
          position: currPosition,
        });
        break;

      case "ArrowUp":
        console.log("up");
        editor.moveCursorUp();
        break;

      case "ArrowDown":
        console.log("down");
        editor.moveCursorDown();
        break;

      case "ArrowLeft":
        console.log("left");
        editor.moveCursorLeft();
        break;

      case "ArrowRight":
        console.log("right");
        editor.moveCursorRight();
        break;

      default:
        if (key.length === 1) {
          editor.insertChar(key, editor.cursor_position);
          socketRef.current?.emit("text-operation", {
            type: "insert",
            userId,
            char: key,
            documentId,
            position: currPosition,
          });
        }
        break;
    }

    // setText(editor.getText());
    setDocText(editor.getTextWithCursors(cursors));
    console.log("cursor_position", editor.cursor_position);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!editor || !editorRef.current) return;
    const rect = editorRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const position = editor.getCursorPosition(x, y, fontInfo);
    console.log("current pos", position);
    editor.setCursorPosition(position);
    setDocText(editor.getTextWithCursors(cursors));
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
            onClick={() => {
              setIsShareDialogOpen(true);
            }}
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
        suppressContentEditableWarning
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        contentEditable={permission !== "read"}
        className={`w-full h-full overflow-x-hidden min-h-64 p-6 caret-transparent bg-[#FEFDF8] border-gray-300 text-gray-900 text-base focus:outline-none overflow-auto ${
          permission === "read" ? "cursor-default bg-gray-50" : ""
        }`}
        // className={`w-full h-full overflow-x-hidden min-h-64 p-3 caret-transparent bg-[#FEFDF8] border-gray-300 text-gray-900 text-base focus:outline-none overflow-auto cursor-default  `}
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "system-ui, -apple-system, sans-serif",
          lineHeight: `${fontInfo.height}px`,
        }}
        dangerouslySetInnerHTML={{ __html: docText }}
      />

      {permission === "read" && (
        <div className="absolute bottom-4 right-4 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1 rounded-md text-sm shadow-sm">
          Read-only mode
        </div>
      )}

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
                  <option value="read">Read</option>
                  <option value="write">Write</option>
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
                onClick={handleShare}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* {isShareDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Share Document
              </h3>
              <button
                onClick={() => setIsShareDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
              >
                <FaTimes size={18} />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-semibold text-gray-700"
                >
                  Username
                </label>
                <input
                  id="username"
                  value={shareUsername}
                  onChange={(e) => setShareUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-3 focus:ring-sky-100 focus:border-sky-500 transition-all duration-200 placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="permission"
                  className="text-sm font-semibold text-gray-700"
                >
                  Permission Level
                </label>
                <select
                  value={shareAccess}
                  onChange={(e) => setShareAccess(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-3 focus:ring-sky-100 focus:border-sky-500 transition-all duration-200 bg-white"
                >
                  <option value="read">Read (View only)</option>
                  <option value="write">Write (Can edit)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {shareStatus && (
                <div
                  className={`text-sm font-medium px-4 py-3 rounded-lg ${
                    shareStatus.includes("Error")
                      ? "text-red-700 bg-red-50 border border-red-200"
                      : "text-green-700 bg-green-50 border border-green-200"
                  }`}
                >
                  {shareStatus}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsShareDialogOpen(false)}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {}}
                className="px-6 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 hover:shadow-lg transition-all duration-200 font-medium"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )} */}

      <style>
        {`
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
