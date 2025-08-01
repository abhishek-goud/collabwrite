import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";

import { Outlet } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

const routes = [
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
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
