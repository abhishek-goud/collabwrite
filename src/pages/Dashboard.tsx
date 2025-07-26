/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import DotOptions from "../components/DotOptions";
import { useNavigate } from "react-router-dom";
import { LoaderIcon } from "lucide-react";

type Document = {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  updatedAt: string;
  access: string;
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center overflow-x-hidden">
      <div className="w-full flex flex-col mt-10 px-[250px] bg-[#F1F3F4]">
        <div>
          <h2 className="text-lg font-light">Start a new document</h2>

          <div
            className="w-[150px] h-[200px] bg-white shadow-xl border border-gray-300 my-5 flex flex-col justify-center items-center cursor-pointer hover:border-blue-500"
            onClick={() => {}}
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
                key={doc.id}
                className="p-3 border rounded-md cursor-pointer flex justify-between items-center hover:bg-gray-100"
              >
                <div onClick={() => navigate(`/app/document/${doc.id}`)}>
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
