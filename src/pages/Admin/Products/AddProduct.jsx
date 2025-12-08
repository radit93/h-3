// src/pages/admin/products/AddProduct.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../lib/supabaseClient";
import { insertProduct } from "./Product.api";

export default function AddProduct() {
  const navigate = useNavigate();

  // -----------------------------------------
  // STATE FORM
  // -----------------------------------------
    const [form, setForm] = useState({
    nama: "",
    brand_id: "",
    category_ids: [],
    grades_id: "",
    deskripsi: "",
    size: "",
    stok: "",
    harga: "",
    gambar1: null,
    gambar2: null,
  });


  // -----------------------------------------
  // DROPDOWN DATA
  // -----------------------------------------
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [grades, setGrades] = useState([]);

  // -----------------------------------------
  // FETCH BRAND DAN CATEGORY
  // -----------------------------------------
  useEffect(() => {
    loadBrands();
    loadCategories();
    loadGrades();
  }, []);

  const loadBrands = async () => {
    const { data, error } = await supabase
      .from("brands")        // 🔴 TABLE: brands
      .select("id, name");

    if (!error) setBrands(data);
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from("categories")    // 🔴 TABLE: categories
      .select("id, name");

    if (!error) setCategories(data);
  };

  const loadGrades = async () => {
    const { data, error } = await supabase
      .from("grades")
      .select("id, name");

    if (!error) setGrades(data);
  };

  // -----------------------------------------
  // HANDLE CHANGE (UNTUK SINGLE FIELD)
  // -----------------------------------------
  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------------
  // HANDLE CHANGE UNTUK MULTI CATEGORY
  // -----------------------------------------
  const toggleCategory = (id) => {
    setForm((prev) => {
      const exists = prev.category_ids.includes(id);

      return {
        ...prev,
        category_ids: exists
          ? prev.category_ids.filter((c) => c !== id)
          : [...prev.category_ids, id],
      };
    });
  };

  // -----------------------------------------
  // UPLOAD KE STORAGE
  // -----------------------------------------
  const uploadImage = async (file) => {
  if (!file) throw new Error("File tidak ditemukan.");

  // rapikan nama file
  const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();

  // wajib masuk folder products/
  const filePath = `products/${Date.now()}-${cleanName}`;

  const { error: uploadError } = await supabase.storage
    .from("product_image")      // bucket benar
    .upload(filePath, file, {
      upsert: false,
      cacheControl: "3600",
    });

  if (uploadError) {
    console.log("SUPABASE STORAGE ERROR:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("product_image")
    .getPublicUrl(filePath);

  return data.publicUrl;
};

  // -----------------------------------------
  // SUBMIT → INSERT KE 6 TABEL
  // -----------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const img1 = form.gambar1 ? await uploadImage(form.gambar1) : null;
      const img2 = form.gambar2 ? await uploadImage(form.gambar2) : null;

      await insertProduct(
        form,
        img1 ,
        img2,
        form.brand_id,        // 🔴 brands.id
        form.category_ids     // 🔴 array categories.id
      );

      navigate("/admin/products");

    } catch (err) {
      console.log("Gagal menambah produk:", err.message);
    }
  };

  return (
    <div className="p-6">

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tambah Produk</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg border text-sm hover:bg-black hover:text-white transition"
        >
          Kembali
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 max-w-3xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* NAMA PRODUK */}
          <FormInput 
            label="Nama Produk"
            name="nama"
            form={form}
            handle={handleChange}
          />

          {/* BRAND */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Brand
            </label>
            <select
              value={form.brand_id}
              onChange={(e) => handleChange("brand_id", e.target.value)}
              className="w-full bg-[#FAF7F0] border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="">Pilih Brand</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* GRADE */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Grade Produk
            </label>
            <select
              value={form.grades_id}
              onChange={(e) => handleChange("grades_id", e.target.value)}
              className="w-full bg-[#FAF7F0] border border-gray-300 rounded-xl px-4 py-3"
            >
              <option value="">Pilih Grade</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* DESKRIPSI */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Deskripsi
            </label>
            <textarea
              className="w-full bg-[#FAF7F0] border border-gray-300 rounded-xl px-4 py-3"
              rows={5}
              value={form.deskripsi}
              onChange={(e) => handleChange("deskripsi", e.target.value)}
            ></textarea>
          </div>

          {/* MULTI CATEGORY CHECKBOX */}
          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Kategori (Boleh lebih dari 1)
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

          {/* SIZE */}
          <FormInput 
            label="Size"
            name="size"
            form={form}
            handle={handleChange}
          />

          {/* STOK */}
          <FormInput 
            label="Stok"
            name="stok"
            type="number"
            form={form}
            handle={handleChange}
          />

          {/* HARGA */}
          <FormInput 
            label="Harga"
            name="harga"
            form={form}
            handle={handleChange}
          />

          {/* GAMBAR 1 */}
          <FormInput
            label="Gambar 1"
            name="gambar1"
            file={true}
            form={form}
            handle={handleChange}
          />

          {/* GAMBAR 2 */}
          <FormInput
            label="Gambar 2"
            name="gambar2"
            file={true}
            form={form}
            handle={handleChange}
          />

        </div>

        <button
          type="submit"
          className="bg-black text-white w-full py-3 rounded-xl font-semibold hover:bg-black/80 transition"
        >
          Simpan Produk
        </button>
      </form>
    </div>
  );
}

//
// UNIVERSAL INPUT COMPONENT
//
function FormInput({ 
  label, 
  name, 
  type = "text", 
  form, 
  handle, 
  file = false 
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-600">
        {label}
      </label>

      {/* INPUT FILE */}
      {file ? (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handle(name, e.target.files[0])}
          className="w-full bg-[#FAF7F0] border border-gray-300 rounded-xl px-4 py-3"
        />
      ) : (
        <input
          name={name}
          type={type}
          value={form[name]}
          onChange={(e) => handle(name, e.target.value)}
          className="w-full bg-[#FAF7F0] border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
        />
      )}
    </div>
  );
}