import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Wrapper from "./pages/Wrapper";

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
    element: <Wrapper />,
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
