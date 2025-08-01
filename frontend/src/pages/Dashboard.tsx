/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import DotOptions from "../components/DotOptions";
import { useNavigate } from "react-router-dom";
import { LoaderIcon } from "lucide-react";
import axios from "../config/axios";

type Document = {
  docId: string;
  title: string;
  createdBy: string;
  updatedAt: string;
  access: string;
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const navigate = useNavigate();

  const handleCreateDocument = async () => {
    try {
      const response = await axios.post("/doc/new", {
        title: "Untitled Document",
      });
      const data = await response.data;
      navigate(`/app/document/${data.docId}`);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getDocuments = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("user/session");
        console.log("User session:", res.data);
        const response = await axios.get("/doc");
        const data = await response.data;
        console.log({ data }, "data");
        setDocuments(data);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getDocuments();
  }, [refresh]);

  return (
    <div className="w-screen h-screen flex flex-col items-center overflow-x-hidden">
      <div className="w-full flex flex-col mt-10 px-[250px] bg-[#F1F3F4]">
        <div>
          <h2 className="text-lg font-light">Start a new document</h2>

          <div
            className="w-[150px] h-[200px] bg-white shadow-xl border border-gray-300 my-5 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500"
            onClick={handleCreateDocument}
          >
            <span className="text-5xl text-blue-500">+</span>
          </div>
        </div>
      </div>

      <div className="w-full px-[250px]">
        <h2 className="text-lg my-5 font-light">Recent Documents</h2>

        {isLoading ? (
          <div className="w-[90%] flex items-center justify-center">
            <LoaderIcon className="size-4 animate-spin text-muted-foreground mt-[10%]" />
          </div>
        ) : documents.length > 0 ? (
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc.docId}
                className="p-3 border rounded-md cursor-pointer flex justify-between items-center hover:bg-gray-100"
              >
                <div onClick={() => navigate(`/app/document/${doc.docId}`)}>
                  <h3 className="font-medium">{doc.title}</h3>
                  <p className="text-sm text-gray-600">
                    Last edited: {new Date(doc.updatedAt).toLocaleString()}
                  </p>
                  <p className="text-sm">Access: {doc.access}</p>
                </div>

                <DotOptions doc={doc} setRefresh={setRefresh} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No documents found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
