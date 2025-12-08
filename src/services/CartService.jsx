import supabase from "../lib/supabaseClient";

export async function addToCart(userId, productId, qty = 1) {
  const { data, error } = await supabase
    .from("cart")
    .insert([{ user_id: userId, product_id: productId, qty }]);

  if (error) throw error;
  return data;
}