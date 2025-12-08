import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProductsByBrandSlug } from "../../services/ProductService";

export default function ProductCarousel({ brandSlug }) {
  const PAGE_SIZE = 5;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProductsByBrandSlug(brandSlug); 
        setProducts(data);     // ✔ SUDAH BERSIH, JANGAN DI-MAP LAGI
        setPage(0);
      } catch (e) {
        console.log("Gagal fetch:", e.message);
      }
    }
    load();
  }, [brandSlug]);

  useEffect(() => {
  if (totalPages <= 1) return;

  const interval = setInterval(() => {
    setPage(prev => {
      if (prev < totalPages - 1) return prev + 1;
      return 0;  // balik lagi ke awal
    });
  }, 5000); // 5 detik

  return () => clearInterval(interval);
}, [totalPages]);


  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const start = page * PAGE_SIZE;
  const visibleProducts = products.slice(start, start + PAGE_SIZE);

  return (
    <div className="relative w-full px-10 mb-12">

      {page > 0 && (
        <button
          onClick={prevPage}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10
             transition-transform duration-200 hover:scale-110"
        >
          <ChevronLeft size={32} strokeWidth={2} />
        </button>
      )}

      <div className="flex justify-between transition-all duration-500 gap-14">
        {visibleProducts.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      {page < totalPages - 1 && (
        <button
          onClick={nextPage}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10
             transition-transform duration-200 hover:scale-110"
        >
          <ChevronRight size={28} strokeWidth={2} />
        </button>
      )}

      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <div
            key={idx}
            onClick={() => setPage(idx)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              idx === page ? "bg-black" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}