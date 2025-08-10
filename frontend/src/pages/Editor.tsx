/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import TextEditor from "../components/TextEditor";
import logo from "../public/logo.svg";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderIcon } from "lucide-react";
import { BsCloudCheck } from "react-icons/bs";
import axios from "../config/axios";

const Editor = () => {
  const navigate = useNavigate();
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("Untitled Document");
  const [username, setUsername] = useState<string>("");
  const [showLoader, setShowLoader] = useState(false);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const response = await axios.get(`/doc/${id}`);
        const data = response.data;
        console.log("Document data:", data);
        setTitle(data.title);
      } catch (err) {
        console.error("Error fetching document");
      }
    };

    fetchDocumentDetails();
  }, [id]);

  useEffect(() => {
    if (editingTitle) {
      setTimeout(() => titleInputRef.current?.focus(), 0);
      console.log("focussed");
    }
  }, [editingTitle]);

  const handleTitleClick = () => {
    setEditingTitle(true);
  };

  const handleTitleBlur = async () => {
    console.log("blurrr");

    setShowLoader(true);
    if (!title.trim()) {
      setTitle("Untitled Document");
    }
    setEditingTitle(false);
    setShowLoader(false);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="w-full flex flex-col items-center mt-2">
        <div className="w-[90%] flex justify-between items-center gap-3">
          <div className="flex justify-start">
            <img
              src={logo}
              alt="collabwrite_logo"
              className="w-[45px] cursor-pointer"
              onClick={() => navigate("/app")}
            />

            <div className="flex items-center gap-2">
              {editingTitle ? (
                <form
                  className="relative w-fit max-w-[50ch]"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleTitleBlur();
                  }}
                >
                  <span className="invisible whitespace-pre px-1.5 text-lg">
                    {title}
                  </span>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    className="absolute inset-0 text-lg text-black px-1.5 bg-transparent truncate"
                  />
                </form>
              ) : (
                <span
                  className="text-lg px-1.5 cursor-pointer truncate"
                  onClick={() => {
                    handleTitleClick();
                    console.log("from span click");
                  }}
                >
                  {title}
                </span>
              )}
              {showLoader && (
                <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
              )}
              {!showLoader && <BsCloudCheck className="size-4" />}
            </div>
          </div>

          <div>
            <h1 className="text-xl font-light">Hi, {username}</h1>
          </div>
        </div>
      </div>
      <TextEditor
        documentId={id}
        username={username}
        setUsername={setUsername}
      />
    </div>
  );
};

export default Editor;
