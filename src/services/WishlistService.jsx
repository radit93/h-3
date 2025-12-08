import supabase from "../lib/supabaseClient";

export async function addToWishlist(userId, productId) {
  const { data, error } = await supabase
    .from("wishlist")
    .insert([{ user_id: userId, product_id: productId }]);

  if (error) throw error;
  return data;
}