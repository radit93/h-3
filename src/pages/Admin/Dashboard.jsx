import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import { PackageSearch, ClipboardList, Users } from "lucide-react";

export default function Dashboard() {
  const [countProducts, setCountProducts] = useState(0);
  const [countOrders, setCountOrders] = useState(0);
  const [countUsers, setCountUsers] = useState(0);

  // Fetch jumlah produk
  const fetchProductsCount = async () => {
    const { count } = await supabase
      .from("product")
      .select("*", { count: "exact", head: true });

    setCountProducts(count || 0);
  };

  // Fetch jumlah order
  const fetchOrdersCount = async () => {
    const { count } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    setCountOrders(count || 0);
  };

  // Fetch jumlah user (dari tabel profiles)
  const fetchUsersCount = async () => {
    const { count } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    setCountUsers(count || 0);
  };

  useEffect(() => {
    fetchProductsCount();
    fetchOrdersCount();
    fetchUsersCount();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* KOTAK TOTAL PRODUK */}
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <PackageSearch size={32} className="text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Produk</p>
            <p className="text-2xl font-bold">{countProducts}</p>
          </div>
        </div>

        {/* KOTAK TOTAL ORDER */}
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <ClipboardList size={32} className="text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Order</p>
            <p className="text-2xl font-bold">{countOrders}</p>
          </div>
        </div>

        {/* KOTAK TOTAL USER */}
        <div className="bg-white shadow rounded-xl p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Users size={32} className="text-purple-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Pengguna</p>
            <p className="text-2xl font-bold">{countUsers}</p>
          </div>
        </div>

      </div>
    </div>
  );
}