import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import DashHeader from "../components/DashHeader";
import axios from "../config/axios";

const Wrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");

  const handleAuth = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user/session");

      const data = await res.data;
      console.log("Session data:", data);

      if (data.message === "Unauthorized") {
        navigate("/");
      }

      setUsername(data.username);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  return (
    <div className="overflow-x-hidden">
      {location.pathname === "/app" && <DashHeader username={username} />}
      <Outlet />
    </div>
  );
};

export default Wrapper;
