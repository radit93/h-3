import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../../lib/supabaseClient";
import { getProductById, updateProduct } from "./Product.api";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  // ------------------------------------------------
  // STATE FORM PRODUK UTAMA
  // ------------------------------------------------
  const [form, setForm] = useState({
    nama: "",
    brand_id: "",
    category_ids: [],
    deskripsi: "",
    gambar1: null,
    gambar2: null,
  });

  // Display image lama
  const [oldImg1, setOldImg1] = useState(null);
  const [oldImg2, setOldImg2] = useState(null);

  // DROPDOWN OPTIONS
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // ------------------------------------------------
  // FETCH DROPDOWN + DATA PRODUK
  // ------------------------------------------------
  useEffect(() => {
    loadBrands();
    loadCategories();
    fetchProductData();
  }, []);

  const loadBrands = async () => {
    const { data } = await supabase.from("brands").select("id, name");
    if (data) setBrands(data);
  };

  const loadCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name");
    if (data) setCategories(data);
  };

  const fetchProductData = async () => {
    const data = await getProductById(id);

    setForm({
      nama: data.name,
      brand_id: data.brand_id,
      category_ids: data.product_categories.map((c) => c.category_id),
      deskripsi: data.description,
      gambar1: null,
      gambar2: null,
    });

    setOldImg1(data.product_image?.[0]?.image_url ?? null);
    setOldImg2(data.product_image?.[1]?.image_url ?? null);

    setLoading(false);
  };

  // ------------------------------------------------
  // HANDLE CHANGE
  // ------------------------------------------------
  const handleChange = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleCategory = (catId) => {
    setForm((prev) => {
      const exists = prev.category_ids.includes(catId);
      return {
        ...prev,
        category_ids: exists
          ? prev.category_ids.filter((c) => c !== catId)
          : [...prev.category_ids, catId],
      };
    });
  };

  // ------------------------------------------------
  // UPLOAD STORAGE
  // ------------------------------------------------
  const uploadImage = async (file) => {
    if (!file) return null;

    const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
    const filePath = `products/${Date.now()}-${cleanName}`;

    const { error } = await supabase.storage
      .from("product_image")
      .upload(filePath, file, { upsert: false });

    if (error) throw error;

    const { data } = supabase.storage
      .from("product_image")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // ------------------------------------------------
  // SUBMIT: UPDATE PRODUCT UTAMA
  // ------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let newImg1 = null;
      let newImg2 = null;

      if (form.gambar1) newImg1 = await uploadImage(form.gambar1);
      if (form.gambar2) newImg2 = await uploadImage(form.gambar2);

      await updateProduct(
        id,
        form,
        newImg1,
        newImg2,
        form.brand_id,
        form.category_ids
      );

      navigate("/admin/products");
    } catch (err) {
      console.log("Gagal update produk:", err.message);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Produk</h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-black px-4 py-2 rounded-lg border text-sm hover:bg-black text-white transition"
        >
          Kembali
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 max-w-3xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* NAMA */}
          <FormInput
            label="Nama Produk"
            name="nama"
            form={form}
            handle={handleChange}
            className="bg-white"
          />

          {/* BRAND */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Brand
            </label>
            <select
              value={form.brand_id}
              onChange={(e) => handleChange("brand_id", e.target.value)}
              className="w-full bg-[#ffffff] border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="">Pilih Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* DESKRIPSI */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Deskripsi
            </label>
            <textarea
              rows={5}
              value={form.deskripsi}
              onChange={(e) => handleChange("deskripsi", e.target.value)}
              className="w-full bg-[#fffff] border border-gray-300 rounded-xl px-4 py-3"
            ></textarea>
          </div>

          {/* CATEGORY */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Kategori
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.category_ids.includes(c.id)}
                    onChange={() => toggleCategory(c.id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          {/* GAMBAR 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Gambar 1 (kosongkan jika tidak diganti)
            </label>
            {oldImg1 && (
              <img src={oldImg1} className="w-20 h-20 object-cover rounded mb-2" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange("gambar1", e.target.files[0])}
              className="w-full bg-[#fffff] border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          {/* GAMBAR 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Gambar 2 (kosongkan jika tidak diganti)
            </label>
            {oldImg2 && (
              <img src={oldImg2} className="w-20 h-20 object-cover rounded mb-2" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleChange("gambar2", e.target.files[0])}
              className="w-full bg-[#fffff] border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

        </div>

        <button
          type="submit"
          className="bg-black text-white w-full py-3 rounded-xl font-semibold hover:bg-black/80 transition"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}

function FormInput({ label, name, type = "text", form, handle }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => handle(name, e.target.value)}
        className="w-full bg-[#fffff] border0 rounded-xl px-4 py-3"
      />
    </div>
  );
}
