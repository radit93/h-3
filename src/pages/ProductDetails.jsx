import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import supabase from "../lib/supabaseClient";
import { useAuth } from "../context/authContext";
import { ShoppingCart, HeartPlus, ArrowLeft } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [gradesGlobal, setGradesGlobal] = useState([]);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [sizeChart, setSizeChart] = useState(null);
  const [showChart, setShowChart] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  const [loading, setLoading] = useState(true);

  // FIXED SIZE BAJU
  const fixedSizesBaju = ["S", "M", "L", "XL", "XXL"];

  // FIXED SIZE SEPATU (36–47)
  const fixedSizesSepatu = Array.from({ length: 12 }, (_, i) =>
    (36 + i).toString()
  );

  // DETEKSI KATEGORI PRODUK
  const categoryName = categories[0]?.categories?.name?.toLowerCase() || "";
  const isApparel =
    categoryName.includes("apparel") ||
    categoryName.includes("baju") ||
    categoryName.includes("shirt");

  const isShoes =
    categoryName.includes("shoes") || categoryName.includes("sepatu");

  // SIZE LIST SESUAI PRODUK
  const sizeList = isApparel ? fixedSizesBaju : fixedSizesSepatu;

  // FETCH DATA
  useEffect(() => {
    async function fetchData() {
      const { data: prod } = await supabase
        .from("product")
        .select("*, brands(name)")
        .eq("id", id)
        .single();

      const { data: imgs } = await supabase
        .from("product_image")
        .select("*")
        .eq("product_id", id)
        .order("order", { ascending: true });

      const { data: vars } = await supabase
        .from("stock_variants")
        .select("*, grades(name)")
        .eq("product_id", id);

      const { data: cat } = await supabase
        .from("product_categories")
        .select("categories(name)")
        .eq("product_id", id);

      const { data: allGrades } = await supabase.from("grades").select("*");

      // FETCH SIZE CHART (AMAN KALO KOSONG)
      let fetchedChart = null;

      if (prod?.brand_id && cat?.[0]?.categories?.name) {
        const brandId = prod.brand_id;
        const categoryNameRaw = cat[0].categories.name; // HARUS MATCH DENGAN size_charts.category_name

        const { data: chartRow } = await supabase
          .from("size_charts")
          .select("image_chart")
          .eq("brand_id", brandId)
          .eq("category_name", categoryNameRaw)
          .maybeSingle(); // tidak error kalau tidak ketemu

        fetchedChart = chartRow || null;
      }

      setProduct(prod);
      setImages(imgs || []);
      setVariants(vars || []);
      setCategories(cat || []);
      setGradesGlobal(allGrades || []);
      setSizeChart(fetchedChart);
      setLoading(false);
    }

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Produk tidak ditemukan</div>;

  // Ambil grades
  const grades = gradesGlobal.map((g) => g.name);

  // SIZE AVAILABLE LOGIC
  const isSizeAvailable = (size) => {
    return variants.some(
      (v) =>
        v.size?.toString().toLowerCase() === size.toString().toLowerCase() &&
        (!selectedGrade || v.grades?.name === selectedGrade) &&
        v.stock > 0
    );
  };

  // GRADE AVAILABLE LOGIC
  const isGradeAvailable = (grade) => {
    return variants.some(
      (v) =>
        v.grades?.name === grade &&
        (!selectedSize || v.size === selectedSize) &&
        v.stock > 0
    );
  };

  const finalVariant = variants.find(
    (v) => v.size === selectedSize && v.grades?.name === selectedGrade
  );

  // CART
  const addToCart = async () => {
  if (!user) {
    navigate("/login");
    return;
  }

  if (!finalVariant) {
    alert("Pilih size dan grades terlebih dahulu");
    return;
  }

  const { data: exist } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", product.id)
    .eq("variant_id", finalVariant.id)
    .maybeSingle();

  if (exist) {
    const newQty = Math.min(exist.quantity + quantity, finalVariant.stock);

    await supabase
      .from("cart")
      .update({ quantity: newQty })
      .eq("id", exist.id);

    window.dispatchEvent(new Event("cart-updated"));
    return;
  }

  await supabase.from("cart").insert([
    {
      user_id: user.id,
      product_id: product.id,
      variant_id: finalVariant.id,
      quantity: quantity,
    },
  ]);

  window.dispatchEvent(new Event("cart-updated"));
};

  // WISHLIST
 const toggleWishlist = async () => {
  if (!user) {
    navigate("/login");
    return;
  }

  const { data: exist } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", product.id)
    .maybeSingle();

  if (exist) {
    await supabase.from("wishlist").delete().eq("id", exist.id);
    window.dispatchEvent(new Event("wishlist-updated"));
    return;
  }

  await supabase.from("wishlist").insert([
    {
      user_id: user.id,
      product_id: product.id,
    },
  ]);

  window.dispatchEvent(new Event("wishlist-updated"));
};


  return (
    <div className="w-full">
      <button
              className="mb-7 mt-7 ml-6 rounded-lg bg-black hover:bg-none text-white transition"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={20} />
            </button>

      {/* GALERI BESAR (FULL-WIDTH SWIPE) */}
      <div
        ref={sliderRef}
        onScroll={() => {
          const container = sliderRef.current;
          const index = Math.round(container.scrollLeft / container.clientWidth);
          setActiveIndex(index);
        }}
        onWheel={(e) => {
        e.preventDefault();

        const container = sliderRef.current;
        const direction = e.deltaY > 0 ? 1 : -1;

        const nextIndex = Math.min(
          Math.max(activeIndex + direction, 0),
          images.length - 1
        );

        container.scrollTo({
          left: container.clientWidth * nextIndex,
          behavior: "smooth",
        });

        setActiveIndex(nextIndex);
      }}
        className="w-full overflow-x-auto overflow-y-hidden overscroll-contain snap-x snap-mandatory flex scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            className="min-w-full flex justify-center snap-start px-6"
          >
            <img
              src={img.image_url}
              alt={product.name}
              className="object-contain w-full max-h-[270px]"
            />
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-2 mt-1 mb-16">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const container = sliderRef.current;
              container.scrollTo({
                left: container.clientWidth * i,
                behavior: "smooth",
              });
            }}
            className={`
              w-3 h-3 rounded-full 
              ${activeIndex === i ? "bg-black" : "bg-gray-300"}
            `}
          />
        ))}
      </div>

      {/* PRODUCT TITLE + BRAND + CATEGORY */}
      <div className="px-6 mt-4 mb-4">
        <h1 className="font-semibold text-[32px] leading-snug">
          {product.name}
        </h1>

        <div className="text-[15px] text-gray-600 mt-1">
          {product.brands?.name}

          {categories.length > 0 && (
            <span className="text-gray-500">
              {" • "}
              {categories.map((c) => c.categories.name).join(", ")}
            </span>
          )}
        </div>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="w-full flex flex-row gap-6 px-6">
        {/* LEFT COLUMN */}
        <div className="w-1/2">
          {/* Harga */}
          <div className="mt-4 text-2xl font-bold">
            {finalVariant
              ? `Rp ${finalVariant.price.toLocaleString("id-ID")}`
              : `Rp ${Math.min(...variants.map((v) => v.price)).toLocaleString(
                  "id-ID"
                )}`}
          </div>

          {/* Deskripsi */}
          <h3 className="font-semibold text-[20px] mt-4">Deskripsi</h3>
          <div className="w-5/6 max-h-[150px] overflow-y-auto border border-gray-200 rounded-lg p-3 mt-2">
            <p className="text-gray-700 text-[15px] leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-1/2 flex flex-col gap-6">
          {/* GRADES */}
          <div>
            <h3 className="font-semibold mb-2">Grades: </h3>
            <div className="flex gap-2 flex-wrap">
              {grades.map((grade) => {
                const available = isGradeAvailable(grade);
                return (
                  <button
                    key={grade}
                    onClick={() =>
                      available &&
                      setSelectedGrade((prev) => (prev === grade ? null : grade))
                    }
                    className={`px-4 py-2 border rounded
                      ${
                        available
                          ? "bg-white"
                          : "bg-gray-300 cursor-not-allowed"
                      }
                      ${
                        selectedGrade === grade
                          ? "border-black font-semibold"
                          : "border-gray-400"
                      }
                    `}
                    disabled={!available}
                  >
                    {grade}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SIZE */}
          <div>
            <h3 className="font-semibold mb-2">Size: </h3>
            <div className="flex gap-2 flex-wrap">
              {sizeList.map((size) => {
                const available = isSizeAvailable(size);
                return (
                  <button
                    key={size}
                    onClick={() =>
                      available &&
                      setSelectedSize((prev) => (prev === size ? null : size))
                    }
                    className={`px-4 py-2 border rounded
                      ${
                        available
                          ? "bg-white"
                          : "bg-gray-300 cursor-not-allowed"
                      }
                      ${
                        selectedSize === size
                          ? "border-black font-semibold"
                          : "border-gray-400"
                      }
                    `}
                    disabled={!available}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 border rounded bg-white"
              >
                -
              </button>

              <span className="text-lg font-semibold w-8 text-center">
                {quantity}
              </span>

              <button
                onClick={() =>
                  finalVariant &&
                  setQuantity((q) => Math.min(finalVariant.stock, q + 1))
                }
                className="px-3 py-1 border rounded bg-white"
              >
                +
              </button>
            </div>

            <p className="text-gray-700 text-sm">
              {finalVariant ? `${finalVariant.stock} stok` : "Pilih variant"}
            </p>
          </div>

          {/* CART + WISHLIST + SIZE CHART */}
          <div className="flex gap-3 items-center">
            {/* ADD TO CART */}
            <button
              onClick={addToCart}
              disabled={!finalVariant}
              className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
                finalVariant ? "bg-black" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={18} />
              Add
            </button>

            {/* WISHLIST */}
            <button
              onClick={toggleWishlist}
              className="flex items-center gap-2 px-4 py-2 rounded border border-gray-500"
            >
              <HeartPlus size={18} />
              Wish
            </button>

            {/* SIZE CHART BUTTON (di kanan) */}
            {sizeChart?.image_chart && (
              <button
                onClick={() => setShowChart(true)}
                className="px-4 py-2 rounded border border-gray-500"
              >
                Size Chart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODAL SIZE CHART */}
      {showChart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
          <div className="bg-white p-4 rounded-lg max-w-md w-full relative">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setShowChart(false)}
              className="absolute top-2 right-2 border px-2 rounded text-black"
            >
              X
            </button>

            <h2 className="font-semibold mb-3 text-lg">Size Chart</h2>

            {sizeChart?.image_chart ? (
              <img
                src={sizeChart.image_chart}
                alt="Size Chart"
                className="w-full h-auto rounded shadow"
              />
            ) : (
              <p className="text-gray-600">Size chart belum tersedia.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
