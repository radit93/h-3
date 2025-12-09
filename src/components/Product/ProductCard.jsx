// src/components/Product/ProductCard.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "../../lib/supabaseClient";
import { useAuth } from "../../context/authContext";
import { ShoppingCart, Heart } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeImage, setActiveImage] = useState(product.images?.[0] || "");
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const productId = Number(product.id);

  useEffect(() => {
    async function checkStock() {
      const { data: vars, error } = await supabase
        .from("stock_variants")
        .select("stock")
        .eq("product_id", productId);

      if (error) {
        console.error("Error checking stock:", error);
        return;
      }

      // Kalau tidak ada variants sama sekali, anggap Out of Stock
      if (!vars || vars.length === 0) {
        setIsOutOfStock(true);
        return;
      }

      const habisSemua = vars.every((v) => !v.stock || v.stock <= 0);
      setIsOutOfStock(habisSemua);
    }

    checkStock();
  }, [productId]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (!user) return;

    const { data: exist } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

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
    if (isOutOfStock) return;
    navigate(`/product/${product.id}`);
  };

  return (
     <div
      className={`cursor-pointer flex flex-col items-center text-center ${
        isOutOfStock ? "cursor-not-allowed" : ""
      }`}
      onClick={() => {
        if (!isOutOfStock) navigate(`/product/${product.id}`);
      }}
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

         {/* OVERLAY OUT OF STOCK */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-gray-300/70 flex items-center justify-center z-10">
            <span className="text-xs font-semibold text-gray-900 tracking-wide">
              Out of Stock
            </span>
          </div>
        )}

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
            className={`p-2 bg-gray-50 ${
              isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={16} color="gray" />
          </button>

          {/* WISHLIST */}
          <button
            onClick={toggleWishlist}
            className={`p-2 bg-gray-50 ${
              isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isOutOfStock}
          >
            <Heart size={16} color="gray" />
          </button>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 mt-2">{product.brand}</p>

      <h3 className="mt-1 text-[13px] font-semibold text-gray-900 leading-tight max-w-[180px]">
        {product.name}
      </h3>

      <p
        className={`text-sm font-semibold mt-2 ${
          isOutOfStock ? "text-red-500" : "text-gray-900"
        }`}
      >
        {isOutOfStock
          ? "Out of Stock"
          : `Rp ${Number(product.price).toLocaleString("id-ID")}`}
      </p>
    </div>
  );
}