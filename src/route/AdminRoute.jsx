import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function AdminRoute({ children }) {
  const { user, profile, loading, profileLoading } = useAuth();
  const location = useLocation();

  if (loading || profileLoading) {
    return <p className="p-6">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <p className="p-6">Loading profile...</p>;
  }

  // jika user bukan admin
  if (profile.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // jika admin mencoba pergi keluar admin (contoh: "/")
  const isAdminPath = location.pathname.startsWith("/admin");
  if (!isAdminPath) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
