export function mapProducts(raw) {
  return raw.map((p) => {
    const sorted =
      p.product_image?.sort((a, b) => a.order - b.order) || [];

    // AMBIL HARGA PALING MURAH
    const lowestPrice = p.stock_variants?.length
      ? Math.min(...p.stock_variants.map((v) => Number(v.price)))
      : 0;

    return {
      id: Number(p.id),
      name: p.name,
      brand: p.brands?.name || "Unknown",
      brand_id: p.brand_id,
      price: lowestPrice,                 // <— Harga termurah
      images: sorted.map((img) => img.image_url),
    };
  });
}
