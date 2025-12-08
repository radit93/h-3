import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  getProductsByBrandSlug,
  getProductsByCategorySlug
} from "../../services/ProductService";

import ProductCard from "../../components/Product/ProductCard";

export default function CategoryPage() {
  const { main, sub } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    load();
  }, [main, sub]);

  async function load() {
    const brandSlugs = ["nike", "adidas", "puma", "reebok", "asics", "newbalance", "converse"];

    if (brandSlugs.includes(main)) {
      const data = await getProductsByBrandSlug(main);
      return setProducts(data);
    }

    const slug = sub ? sub : main;
    const data = await getProductsByCategorySlug(slug);
    setProducts(data);
  }

  return (
    <div className="p-6">

      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mb-4"
      >
        ← Kembali
      </button>

      <h1 className="text-xl font-bold mb-4 capitalize">
        {main} {sub && "> " + sub}
      </h1>

      {products.length === 0 && <p className="text-center">Tidak ada produk.</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

    </div>
  );
}