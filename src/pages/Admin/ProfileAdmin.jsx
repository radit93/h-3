import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";

export default function ProfileAdmin() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [username, setUsername] = useState("");
  const [alamat, setAlamat] = useState("");
  const [noHp, setNoHp] = useState("");
  const [pass, setPass] = useState("");

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(data);

      setUsername(data.usernames || "");
      setAlamat(data.alamat || "");
      setNoHp(data.no_hp || "");
      setPass(data.pass || "");
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await supabase
        .from("profiles")
        .update({
          usernames: username,
          alamat,
          no_hp: noHp,
          pass,
        })
        .eq("id", profile.id);

      alert("Profil berhasil diperbarui!");
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      alert("Gagal update profil: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Profile Admin</h1>
        <p>Memuat...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Profile Admin</h1>
        <p>Data tidak ditemukan.</p>
      </div>
    );
  }

  // ======================================================
  // FIELD INPUT SESUAI SCREENSHOT (bg abu, rounded, clean)
  // ======================================================
  const Field = ({ label, value, setter, editable }) => (
    <div className="flex flex-col mb-4">
      <label className="text-gray-600 text-sm mb-1">{label}</label>

      {editable ? (
        <input
          value={value}
          onChange={(e) => setter(e.target.value)}
          className="w-full bg-gray-200 p-3 rounded-lg text-gray-900 border border-gray-300 outline-none"
        />
      ) : (
        <div className="w-full bg-gray-200 p-3 rounded-lg text-gray-900">
          {value || "Tidak ada"}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-xl">

      <h1 className="text-2xl font-bold mb-6">Profile Admin</h1>

      <div className="bg-white shadow p-8 rounded-xl">

        {/* USERNAME */}
        <Field
          label="Username"
          value={username}
          setter={setUsername}
          editable={editMode}
        />

        {/* EMAIL (tidak bisa edit) */}
        <div className="flex flex-col mb-4">
          <label className="text-gray-600 text-sm mb-1">Email</label>
          <div className="w-full bg-gray-200 p-3 rounded-lg text-gray-900">
            {profile.email}
          </div>
        </div>

        {/* ALAMAT */}
        <Field
          label="Alamat"
          value={alamat}
          setter={setAlamat}
          editable={editMode}
        />

        {/* NO HP */}
        <Field
          label="No HP"
          value={noHp}
          setter={setNoHp}
          editable={editMode}
        />

        {/* PASSWORD */}
        <Field
          label="Password"
          value={pass}
          setter={setPass}
          editable={editMode}
        />

        {/* ROLE */}
        <div className="flex flex-col mb-6">
          <label className="text-gray-600 text-sm mb-1">Role</label>
          <div className="w-full bg-gray-200 p-3 rounded-lg text-gray-900">
            {profile.role}
          </div>
        </div>

        {/* BUTTON */}
        {editMode ? (
          <button
            onClick={handleSave}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold"
          >
            Simpan
          </button>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold"
          >
            Edit Profil
          </button>
        )}
      </div>
    </div>
  );
}