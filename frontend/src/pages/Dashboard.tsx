/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import DotOptions from "../components/DotOptions";
import { useNavigate } from "react-router-dom";
import {
  LoaderIcon,
  FileText,
  Plus,
  Clock,
  Lock,
  Globe,
  Users,
} from "lucide-react";

type Cursor = {
  userId: string;
  username: string;
  position: number;
  color: string;
};

type Document = {
  id: string;
  docId: string;
  title: string;
  cursors: Cursor[];
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

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/doc/", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch documents: ${response.status}`);
        }

        const data = await response.json();

        const parsedDocuments: Document[] = Object.entries(data).map(
          ([id, doc]) => ({
            id,
            ...(doc as Omit<Document, "id">),
          })
        );

        console.log(parsedDocuments, "parsedDocuments");

        setDocuments(parsedDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [refresh]);

  const handleCreateDocument = async () => {
    console.log("Creating new document...");
    try {
      const response = await fetch(`http://localhost:3000/doc/new/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: `Untitled Document` }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create document: ${response.status}`);
      }

      const responseObj = await response.json();

      navigate(`/app/document/${responseObj.docId}`);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Create New Document */}
        <div className="mb-16">
          <h2 className="text-lg font-medium text-slate-700 mb-6">
            Create New
          </h2>

          <div
            className="w-48 h-64 bg-white border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center group"
            onClick={handleCreateDocument}
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-8 h-8 text-slate-600" />
            </div>
            <span className="text-slate-600 font-medium">New Document</span>
            <span className="text-sm text-slate-500 mt-1">Start writing</span>
          </div>
        </div>

        {/* Recent Documents */}
        {/* <div className="w-full ">
          <h2 className="text-lg my-5 font-light">Recent Documents</h2>

          {isLoading ? (
            // <p>Loading...</p>
            // <LoaderIcon className="absolute size-4 animate-spin text-muted-foreground" />
            <div className="w-[90%] flex items-center justify-center">
              <LoaderIcon className="size-4 animate-spin text-muted-foreground mt-[10%]" />
            </div>
          ) : documents.length > 0 ? (
            <ul className="space-y-2">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="p-3 border bg-white rounded-md cursor-pointer flex justify-between items-center hover:bg-gray-50"
                >
                  <div onClick={() => navigate(`/app/document/${doc.id}`)}>
                    <h3 className="font-medium">{doc.title}</h3>
                    <p className="text-sm text-gray-600">
                      {formatTimeAgo(doc.updatedAt)}
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
        </div> */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Recent Documents
            </h2>
            {documents.length > 0 && (
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {documents.length} documents
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <LoaderIcon className="w-5 h-5 animate-spin text-slate-400 mr-3" />
              <span className="text-slate-600">Loading documents...</span>
            </div>
          ) : documents.length > 0 ? (
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li
                  key={doc.id}
                  className="p-4 border border-slate-200 bg-white rounded-xl shadow-sm cursor-pointer flex justify-between items-center hover:bg-slate-50 hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
                >
                  <div
                    onClick={() => navigate(`/app/document/${doc.docId}`)}
                    className="flex-1"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <FileText className="w-4 h-4 text-slate-600" />
                      </div>
                      <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                        {doc.title}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-500 ml-11">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTimeAgo(doc.updatedAt)}</span>
                      </div>

                      <div className="flex items-center space-x-1">
                        {doc.access.toLowerCase() === "private" ? (
                          <>
                            <Lock className="w-3 h-3 text-amber-500" />
                            <span className="text-amber-600">Private</span>
                          </>
                        ) : (
                          <>
                            <Globe className="w-3 h-3 text-green-500" />
                            <span className="text-green-600">Public</span>
                          </>
                        )}
                      </div>

                      {doc.cursors && doc.cursors.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-1">
                            {doc.cursors.slice(0, 3).map((cursor, index) => (
                              <div
                                key={cursor.userId}
                                className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm"
                                style={{ backgroundColor: cursor.color }}
                                title={cursor.username}
                              >
                                {cursor.username.charAt(0).toUpperCase()}
                              </div>
                            ))}
                            {doc.cursors.length > 3 && (
                              <div className="w-5 h-5 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-xs font-medium text-white shadow-sm">
                                +{doc.cursors.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">
                            {doc.cursors.length} active
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <DotOptions doc={doc} setRefresh={setRefresh} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No documents yet
              </h3>
              <p className="text-slate-500 mb-6">
                Create your first document to get started
              </p>
              <button
                onClick={handleCreateDocument}
                className="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
