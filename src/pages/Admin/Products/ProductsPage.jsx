import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus, Bolt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "./Product.api";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      const result = await getProducts();
      setProducts(result || []);
    } catch (err) {
      console.error("Gagal fetch produk:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  return (
    <div className="p-6">
      {/* HEADER TITLE */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Data Produk</h1>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      {/* HEADER TABEL */}
      <div className="grid grid-cols-12 font-semibold border-b py-3 text-sm">
        <div className="col-span-2">Nama</div>
        <div>Brand</div>
        <div className="col-span-2">Kategori</div>
        <div>Stok</div>
        <div>Grade</div>
        <div>Size</div>
        <div>Harga</div>
        <div>Gambar 1</div>
        <div>Gambar 2</div>
        <div className="text-center">Aksi</div>
      </div>

      {/* DATA */}
      {products.map((p) => (
        <div key={p.id} className="border-b py-4 text-sm">
          
          {/* ROW UTAMA */}
          <div className="grid grid-cols-12 items-center">

            {/* NAMA */}
            <div className="col-span-2 font-medium">{p.name}</div>

            {/* BRAND */}
            <div>{p.brands?.name ?? "-"}</div>

            {/* KATEGORI */}
            <div className="col-span-2">
              {p.product_categories?.length > 0 ? (
                p.product_categories.map((c, i) => (
                  <span
                    key={i}
                    className="inline-block bg-gray-200 rounded px-2 py-1 text-xs mr-1"
                  >
                    {c.categories?.name}
                  </span>
                ))
              ) : (
                "-"
              )}
            </div>

            {/* STOK (varian pertama saja) */}
            <div>
              {p.stock_variants?.length > 0 ? p.stock_variants[0].stock : "-"}
            </div>

            {/* GRADE 1 */}
            <div>
              {p.stock_variants?.length > 0
                ? p.stock_variants[0].grades?.name
                : "-"}
            </div>

            {/* SIZE 1 */}
            <div>
              {p.stock_variants?.length > 0 ? p.stock_variants[0].size : "-"}
            </div>

            {/* HARGA 1 */}
            <div>
              {p.stock_variants?.length > 0
                ? `Rp ${p.stock_variants[0].price.toLocaleString("id-ID")}`
                : "-"}
            </div>

            {/* GAMBAR 1 */}
            <div>
              {p.product_image?.[0] ? (
                <img
                  src={p.product_image[0].image_url}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                "-"
              )}
            </div>

            {/* GAMBAR 2 */}
            <div>
              {p.product_image?.[1] ? (
                <img
                  src={p.product_image[1].image_url}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                "-"
              )}
            </div>

            {/* AKSI */}
            <div className="flex justify-center gap-3">
              {/* EDIT PRODUCT */}
              <button onClick={() => navigate(`/admin/products/edit/${p.id}`)}>
                <Bolt size={18} className="text-black" />
              </button>

              {/* EDIT VARIANT */}
              <button
                onClick={() => navigate(`/admin/products/${p.id}/variants`)}
              >
                <Pencil size={18} className="text-blue-600" />
              </button>

              {/* DELETE */}
              <button onClick={() => handleDelete(p.id)}>
                <Trash2 size={18} className="text-red-600" />
              </button>
            </div>

          </div>

          {/* ================================
               VARIANTS LIST LANGSUNG TAMPIL
          ================================= */}
          <div className="mt-3 ml-4 space-y-2">
            {p.stock_variants?.length > 0 ? (
              p.stock_variants.map((v) => (
                <div
                  key={v.id}
                  className="grid grid-cols-4 gap-4 bg-gray-100 px-4 py-2 rounded"
                >
                  <div>
                    <span className="font-semibold">Size:</span> {v.size}
                  </div>
                  <div>
                    <span className="font-semibold">Grade:</span>{" "}
                    {v.grades?.name}
                  </div>
                  <div>
                    <span className="font-semibold">Harga:</span>{" "}
                    Rp {Number(v.price).toLocaleString("id-ID")}
                  </div>
                  <div>
                    <span className="font-semibold">Stok:</span> {v.stock}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm ml-1">
                Tidak ada varian.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}