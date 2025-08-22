import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "./api.js";


export default function ProtectedRoute({ children, allowedRole }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation(); // 🔑 detect route change

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/me`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, [location.pathname]); // ✅ recheck auth on every route change

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
