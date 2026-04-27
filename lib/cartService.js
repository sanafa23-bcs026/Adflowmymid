import { supabase } from "./supabase";

export async function getCartItems(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("cart")
    .select("id, ad_id, ads(id, title, price, image_url, location, category, featured, status, expire_at)")
    .eq("user_id", userId)
    .order("id", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getCartCount(userId) {
  if (!userId) return 0;

  const { count, error } = await supabase
    .from("cart")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw error;
  return count || 0;
}

export async function isAdInCart(userId, adId) {
  if (!userId || !adId) return false;

  const { data, error } = await supabase
    .from("cart")
    .select("id")
    .eq("user_id", userId)
    .eq("ad_id", adId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function addAdToCart(userId, adId) {
  if (!userId || !adId) {
    throw new Error("User and ad are required.");
  }

  const exists = await isAdInCart(userId, adId);
  if (exists) return { alreadyInCart: true };

  const { data, error } = await supabase
    .from("cart")
    .insert([{ user_id: userId, ad_id: adId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeAdFromCart(userId, adId) {
  if (!userId || !adId) {
    throw new Error("User and ad are required.");
  }

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", userId)
    .eq("ad_id", adId);

  if (error) throw error;
  return true;
}

export async function toggleCartItem(userId, adId) {
  const exists = await isAdInCart(userId, adId);
  if (exists) {
    await removeAdFromCart(userId, adId);
    return { inCart: false };
  }

  await addAdToCart(userId, adId);
  return { inCart: true };
}
