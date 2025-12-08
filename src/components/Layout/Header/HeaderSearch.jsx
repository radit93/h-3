// src/components/Header/HeaderSearch.jsx
import { Search } from "lucide-react";

export default function HeaderSearch({ query, setQuery, handleSearch }) {
  return (
    <div className="relative w-40">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
        strokeWidth={1.5}
        size={18}
      />
      <input
        type="text"
        placeholder="Search"
        value={query}
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);          // kirim update ke Header
        }}
        onKeyDown={handleSearch}
        className="w-full bg-white border border-gray-300 rounded-full py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
      />
    </div>
  );
}