import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Mencari:", query);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Pencarian Produk
        </h1>
        <form onSubmit={handleSearch} className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Cari produk..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-black/40 bg-white"
            required
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-3 rounded-xl hover:bg-black/90 transition flex items-center justify-center"
          >
            <Search size={20} />
          </button>
        </form>
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-800 mb-3">Hasil:</h2>
          {query === "" ? (
            <p className="text-gray-500">Masukkan kata kunci untuk mencari produk.</p>
          ) : (
            <p className="text-gray-700">Menampilkan hasil untuk: <b>{query}</b></p>
          )}
        </div>

      </div>
    </main>
  );
}
