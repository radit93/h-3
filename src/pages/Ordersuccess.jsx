import { useNavigate } from "react-router-dom";

export default function Ordersuccess() {
  const navigate = useNavigate();

  return (
    <main className="p-6 max-w-xl mx-auto text-center">
      <div className="bg-white p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold mb-4 tracking-wide">
          Order Berhasil
        </h1>

        <p className="text-gray-700 mb-6 leading-relaxed">
          Pesananmu sudah kami terima dan sedang diproses. 
          Silakan cek statusnya di halaman riwayat order.
        </p>

        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Lihat Riwayat Order
        </button>
      </div>
    </main>
  );
}