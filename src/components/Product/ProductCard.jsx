// src/components/Product/ProductCard.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import supabase from "../../lib/supabaseClient";
import { useAuth } from "../../context/authContext";
import { ShoppingCart, Heart } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeImage, setActiveImage] = useState(product.images?.[0] || "");
  const productId = Number(product.id);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!user) return;

    const { data: exist } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (exist) {
      await supabase.from("wishlist").delete().eq("id", exist.id);
      window.dispatchEvent(new Event("wishlist-updated"));
      return;
    }

    await supabase.from("wishlist").insert([
      {
        user_id: user.id,
        product_id: productId,
      },
    ]);

    window.dispatchEvent(new Event("wishlist-updated"));
  };

  // **CART SEKARANG CUMA NAVIGATE**
  const goToDetailsForCart = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="cursor-pointer flex flex-col items-center text-center"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative group w-[180px] h-[180px] overflow-hidden"> 
        <div className="w-[180px] h-[180px] flex items-center justify-center">
          <img
            src={activeImage}
            alt={product.name}
            className="object-contain max-h-[180px] transition-transform duration-600 group-hover:scale-105"
            onMouseEnter={() =>
              product.images?.[1] && setActiveImage(product.images[1])
            }
            onMouseLeave={() =>
              setActiveImage(product.images?.[0] || "")
            }
          />
        </div>

        <div
          className="
          absolute top-2 right-0 flex 
          flex-col translate-x-full 
          opacity-0 group-hover:translate-x-0 
          group-hover:opacity-100 transition-all duration-300"
        >
          {/* CART BUTTON → NAVIGATE */}
          <button
            onClick={goToDetailsForCart}
            className="p-2 bg-gray-50 "
          >
            <ShoppingCart size={16} color="gray" />
          </button>

          {/* WISHLIST */}
          <button
            onClick={toggleWishlist}
            className="p-2 bg-gray-50"
          >
            <Heart size={16} color="gray" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 mt-2">{product.brand}</p>

      <h3 className="mt-1 text-[13px] font-semibold text-gray-900 leading-tight max-w-[180px]">
        {product.name}
      </h3>

      <p className="text-sm font-semibold text-gray-900 mt-2">
        Rp {Number(product.price).toLocaleString("id-ID")}
      </p>
    </div>
  );
}