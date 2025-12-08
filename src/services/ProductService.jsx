// src/services/ProductService.jsx
import supabase from "../lib/supabaseClient";
import { BRAND_MAP } from "../utils/BrandMap";
import { mapProducts } from "../data/ProductMapper";

// ======================
// GET PRODUCT BY BRAND
// ======================
export async function getProductsByBrandSlug(slug) {
  const brandId = BRAND_MAP[slug];
  if (!brandId) return [];

  const { data, error } = await supabase
    .from("product")
    .select(`
      id,
      name,
      brand_id,
      brands ( name ),
      product_image ( order, image_url ),
      stock_variants ( price ),
      product_categories (
        categories ( slug )
      )
    `)
    .eq("brand_id", brandId);

  if (error) throw error;
  return mapProducts(data);
}

// =======================
// GET PRODUCT BY CATEGORY
// =======================
export async function getProductsByCategorySlug(slug) {
  const { data, error } = await supabase
    .from("product")
    .select(`
      id,
      name,
      brand_id,
      brands ( name ),
      product_image ( order, image_url ),
      stock_variants ( price ),
      product_categories (
        categories ( slug )
      )
    `);

  if (error) throw error;

  // filter berdasarkan SLUG kategori
  const filtered = data.filter((p) =>
    p.product_categories?.some((pc) => pc.categories?.slug === slug)
  );

  return mapProducts(filtered);
}

// =======================
// SEARCH
// =======================
export async function searchProducts(query) {
  const { data, error } = await supabase
    .from("product")
    .select(`
      id,
      name,
      brand_id,
      brands ( name ),
      product_image ( order, image_url ),
      stock_variants ( price ),
      product_categories (
        categories ( slug )
      )
    `)
    .ilike("name", `%${query}%`)
    .order("id", { ascending: true });

  if (error) throw error;

  return mapProducts(data);
}