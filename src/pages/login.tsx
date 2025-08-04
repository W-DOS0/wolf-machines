import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export default function Logout() {
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(null);
    navigate("/login", { replace: true });
  }, [setUser, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Logging out...</p>
    </div>
  );
}
