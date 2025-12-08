import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch semua data product detail
  useEffect(() => {
    async function fetchData() {
      // Fetch product
      const { data: prod } = await supabase
        .from("product")
        .select("*, brands(name)")
        .eq("id", id)
        .single();

      // Fetch images
      const { data: imgs } = await supabase
        .from("product_image")
        .select("*")
        .eq("product_id", id)
        .order("order", { ascending: true });

      // Fetch stock variants
      const { data: vars } = await supabase
        .from("stock_variants")
        .select("*, grades(name)")
        .eq("product_id", id);

      setProduct(prod);
      setImages(imgs || []);
      setVariants(vars || []);
      setLoading(false);
    }

    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Produk tidak ditemukan</div>;

  // Ambil list unik size
  const sizes = [...new Set(variants.map((v) => v.size))];

  // Ambil list unik grades
  const grades = [...new Set(variants.map((v) => v.grades?.name))];

  // Filter size mana yg punya stok untuk grade yg dipilih
  const isSizeAvailable = (size) => {
    if (!selectedGrade) return true;
    return variants.some(
      (v) =>
        v.size === size &&
        v.grades?.name === selectedGrade &&
        v.stock > 0
    );
  };

  // Filter grades mana yg punya stok untuk size yg dipilih
  const isGradeAvailable = (grade) => {
    if (!selectedSize) return true;
    return variants.some(
      (v) =>
        v.grades?.name === grade &&
        v.size === selectedSize &&
        v.stock > 0
    );
  };

  // Cari variant final yang cocok
  const finalVariant = variants.find(
    (v) =>
      v.size === selectedSize &&
      v.grades?.name === selectedGrade
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      
      {/* GALERI GAMBAR */}
      <div className="w-full mb-4">
        <div className="flex overflow-x-auto gap-3">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.image_url}
              alt={product.name}
              className="w-60 h-60 object-cover rounded-md"
            />
          ))}
        </div>
      </div>

      {/* INFORMASI PRODUK */}
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <p className="text-gray-600">{product.brands?.name}</p>
      <p className="mt-2">{product.description}</p>

      {/* SIZE SELECTOR */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Pilih Size</h3>
        <div className="flex gap-2 flex-wrap">
          {sizes.map((size) => {
            const available = isSizeAvailable(size);
            return (
              <button
                key={size}
                onClick={() => available && setSelectedSize(size)}
                className={`px-4 py-2 border rounded
                  ${available ? "bg-white" : "bg-gray-300 cursor-not-allowed"}
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

      {/* GRADES SELECTOR */}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Pilih Grades</h3>
        <div className="flex gap-2 flex-wrap">
          {grades.map((grade) => {
            const available = isGradeAvailable(grade);
            return (
              <button
                key={grade}
                onClick={() => available && setSelectedGrade(grade)}
                className={`px-4 py-2 border rounded
                  ${available ? "bg-white" : "bg-gray-300 cursor-not-allowed"}
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

      {/* HARGA */}
      <div className="mt-6 text-xl font-semibold">
        {finalVariant ? (
          <p>Harga: Rp {finalVariant.price.toLocaleString()}</p>
        ) : (
          <p>Pilih size dan grades untuk melihat harga</p>
        )}
      </div>
    </div>
  );
}
