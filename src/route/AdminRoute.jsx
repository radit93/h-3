import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function AdminRoute({ children }) {
  const { user, profile, loading, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || profileLoading) {
    return <p className="p-6">Loading...</p>;
  }

  // Tidak login → suruh login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Profil belum ada → jangan rusuh
  if (!profile) {
    return <p className="p-6">Loading profile...</p>;
  }

  // Role bukan admin → tendang ke dashboard user
  if (profile.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin mencoba keluar dari zona /admin
  const isInsideAdmin = location.pathname.startsWith("/admin");
  if (!isInsideAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
