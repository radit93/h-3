import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getVariants,
  getAllGrades,
  addVariant,
  updateVariantField,
  deleteVariant,
} from "./Product.api";

export default function EditVariant() {
  const { id } = useParams(); // product_id
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState([]);
  const [grades, setGrades] = useState([]);

  const [form, setForm] = useState({
    size: "",
    grades_id: "",
    price: "",
    stock: ""
  });

  // -------------------------------------------------------
  // LOAD DATA VARIANTS + GRADES
  // -------------------------------------------------------
  useEffect(() => {
    async function load() {
      const gradesData = await getAllGrades();
      const variantsData = await getVariants(id);

      setGrades(gradesData);
      setVariants(variantsData);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleChange = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  // -------------------------------------------------------
  // TAMBAH VARIAN BARU
  // -------------------------------------------------------
  const handleAddVariant = async () => {
    if (!form.size || !form.grades_id || !form.price || !form.stock) {
      alert("Lengkapi semua field varian!");
      return;
    }

    try {
      await addVariant(id, form);

      const updated = await getVariants(id);
      setVariants(updated);

      setForm({ size: "", grades_id: "", price: "", stock: "" });
    } catch (err) {
      alert("Gagal menambah varian: " + err.message);
    }
  };

  // -------------------------------------------------------
  // UPDATE FIELD VARIAN (ON BLUR)
  // -------------------------------------------------------
  const handleUpdate = async (variantId, field, value) => {
    await updateVariantField(variantId, field, value);

    const updated = await getVariants(id);
    setVariants(updated);
  };

  // -------------------------------------------------------
  // HAPUS VARIAN
  // -------------------------------------------------------
  const handleDelete = async (variantId) => {
    if (!confirm("Hapus varian ini?")) return;

    await deleteVariant(variantId);

    const updated = await getVariants(id);
    setVariants(updated);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  // -------------------------------------------------------
  // UI
  // -------------------------------------------------------
  return (
    <div className="p-6">

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Varian Produk</h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-black px-4 py-2 rounded-lg border hover:bg-black text-white"
        >
          Kembali
        </button>
      </div>

      {/* ---------------------- */}
      {/* TABEL VARIAN           */}
      {/* ---------------------- */}
      <table className="w-full border mb-10">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Size</th>
            <th className="p-3 border">Grade</th>
            <th className="p-3 border">Harga</th>
            <th className="p-3 border">Stok</th>
            <th className="p-3 border">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {variants.map((v) => (
            <tr key={v.id}>
              <td className="border p-2">
                <input
                  type="text"
                  defaultValue={v.size}
                  onBlur={(e) =>
                    handleUpdate(v.id, "size", Number(e.target.value))
                  }
                  className="w-full bg-[#FAF7F0] border rounded px-2 py-1"
                />
              </td>

              <td className="border p-2">{v.grades?.name}</td>

              <td className="border p-2">
                <input
                  type="number"
                  defaultValue={v.price}
                  onBlur={(e) =>
                    handleUpdate(v.id, "price", Number(e.target.value))
                  }
                  className="w-full bg-[#FAF7F0] border rounded px-2 py-1"
                />
              </td>

              <td className="border p-2">
                <input
                  type="number"
                  defaultValue={v.stock}
                  onBlur={(e) =>
                    handleUpdate(v.id, "stock", Number(e.target.value))
                  }
                  className="w-full bg-[#FAF7F0] border rounded px-2 py-1"
                />
              </td>

              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(v.id)}
                  className="text-red-600 hover:underline"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------------------- */}
      {/* FORM TAMBAH VARIAN     */}
      {/* ---------------------- */}
      <h2 className="text-xl font-semibold mb-3">Tambah Varian Baru</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div>
          <label>Size</label>
          <input
            type="text"
            value={form.size}
            onChange={(e) => handleChange("size", e.target.value)}
            className="w-full bg-[#FAF7F0] border rounded px-3 py-2"
          />
        </div>

        <div>
          <label>Grade</label>
          <select
            value={form.grades_id}
            onChange={(e) => handleChange("grades_id", e.target.value)}
            className="w-full bg-[#FAF7F0] border rounded px-3 py-2"
          >
            <option value="">Pilih Grade</option>
            {grades.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Harga</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full bg-[#FAF7F0] border rounded px-3 py-2"
          />
        </div>

        <div>
          <label>Stok</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className="w-full bg-[#FAF7F0] border rounded px-3 py-2"
          />
        </div>
      </div>

      <button
        onClick={handleAddVariant}
        className="bg-black text-white px-6 py-3 rounded-xl hover:bg-black/80"
      >
        Tambah Varian
      </button>
    </div>
  );
}
