// src/components/Product/SectionTitle.jsx
import { useNavigate } from "react-router-dom";

export default function SectionTitle({ title, link }) {
  const navigate = useNavigate();

  return (
    <div className="w-full flex items-center justify-between px-10 mb-6">
      
      {/* Title kiri */}
      <h2 className="text-[22px] font-bold">
        {title}
      </h2>

      {/* Button kanan */}
      <button
        onClick={() => navigate(link)}
        className="text-sm font-semibold"
      >
        VIEW ALL
      </button>

    </div>
  );
}
