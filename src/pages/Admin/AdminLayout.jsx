import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import supabase from "../../lib/supabaseClient";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 transition-all duration-300 
        ${sidebarOpen ? "translate-x-0 w-64 p-6" : "-translate-x-full w-64 p-0"}`}
      >
        <button
          className="mb-6"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={26} />
        </button>

        <ul className="space-y-4 text-lg">

          <li>
            <Link
              to="/admin"
              className={`block ${
                location.pathname === "/admin"
                  ? "font-bold text-black"
                  : "text-gray-700"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/admin/profile"
              className={`block ${
                location.pathname.includes("profile")
                  ? "font-bold text-black"
                  : "text-gray-700"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              Profile Admin
            </Link>
          </li>

          <li>
            <Link
              to="/admin/products"
              className={`block ${
                location.pathname.includes("products")
                  ? "font-bold text-black"
                  : "text-gray-700"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              Data Produk
            </Link>
          </li>

          <li>
            <Link
              to="/admin/orders"
              className={`block ${
                location.pathname.includes("orders")
                  ? "font-bold text-black"
                  : "text-gray-700"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              Data Order
            </Link>
          </li>

          <li
            className="text-red-600 cursor-pointer mt-6"
            onClick={async () => {
              await supabase.auth.signOut();  // matikan session Supabase
              localStorage.clear();           // bersihin token lokal
              window.location.href = "/";     // paksa reload biar context reset
            }}>Logout
          </li>

        </ul>
      </div>

      {/* OVERLAY (biar sidebar nutup kalau klik luar) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 min-h-screen bg-white">
        {/* HEADER */}
        <header className="w-full bg-white shadow py-4 px-6 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={26} />
          </button>
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </header>

        {/* ROUTE CONTENT */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}