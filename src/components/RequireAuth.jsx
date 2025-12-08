import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Tunggu authContext selesai load user
  if (loading) return null;

  // Halaman yang boleh diakses tanpa login
  const publicRoutes = ["/", "/login", "/register", "/search"];

  // Pisahkan pathname utama tanpa query atau path tambahan
  const path = location.pathname.split("?")[0];

  const isPublic = publicRoutes.includes(path);

  // Kalau belum login dan buka halaman selain public → paksa ke login
  if (!user && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  // Kalau sudah login → biarkan anak route jalan normal
  return children;
}