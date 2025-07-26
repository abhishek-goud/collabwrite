import App from "./App";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";

import { Outlet } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/app",
    element: <Outlet />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "document/:id",
        element: <Editor />,
      },
    ],
  },
];

export default routes;
