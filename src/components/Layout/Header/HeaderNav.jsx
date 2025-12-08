import { ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { categories } from "./categoriesData";
import { useSearch } from "../../../context/SearchContext";

export default function HeaderNav() {
  const navigate = useNavigate();
  const { setSearchQuery } = useSearch();

  return (
    <nav className="flex-1 flex justify-center">
      <ul className="flex items-center gap-10 text-sm font-bold text-gray-900">
        {categories.map((cat, i) => (
          <li key={i} className="relative group cursor-pointer flex items-center gap-1">

            <div className="flex items-center gap-2 pb-1 hover:text-black transition">
              {cat.name}

              {cat.submenu.length > 0 && (
                <span>
                  <ChevronRight size={16} className="text-gray-600 group-hover:hidden block" />
                  <ChevronDown size={16} className="text-gray-900 hidden group-hover:block" />
                </span>
              )}

              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </div>

            {cat.submenu.length > 0 && (
              <div className="absolute top-full mt-2 left-0 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <ul className="py-2">
                  {cat.submenu.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => {
                        setSearchQuery("");     // reset search agar Main.jsx tidak override
                        navigate(item.path);    // navigate ke kategori
                        window.scrollTo(0, 0);
                      }}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      {item.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}