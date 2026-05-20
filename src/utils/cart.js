import { supabase } from "../lib/supabase";

// GET CURRENT USER FROM LOCALSTORAGE
const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  return JSON.parse(user);
};

// GET CART
export const getCart = async () => {
  const user = getCurrentUser();

  if (!user) {
    console.log("NO USER LOGGED IN");
    return [];
  }

  const { data, error } = await supabase
    .from("cart")
    .select("*, products(*)")
    .eq("user_id", user.id);

  if (error) {
    console.log("GET CART ERROR:", error.message);
    return [];
  }

  return data || [];
};

// ADD TO CART
export const addToCart = async (productId) => {
  const user = getCurrentUser();

  if (!user) {
    console.log("NO USER LOGGED IN");
    return;
  }

  // CHECK IF PRODUCT EXISTS
  const { data: existingItem, error: selectError } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (selectError) {
    console.log("SELECT ERROR:", selectError.message);
    return;
  }

  // IF EXISTS -> UPDATE QUANTITY
  if (existingItem) {
    const { error } = await supabase
      .from("cart")
      .update({
        quantity: existingItem.quantity + 1,
      })
      .eq("id", existingItem.id);

    if (error) {
      console.log("UPDATE CART ERROR:", error.message);
    } else {
      console.log("QUANTITY UPDATED");
    }

    return;
  }

  // INSERT NEW ITEM
  const { error } = await supabase.from("cart").insert([
    {
      user_id: user.id,
      product_id: productId,
      quantity: 1,
    },
  ]);

  if (error) {
    console.log("ADD TO CART ERROR:", error.message);
  } else {
    console.log("ADDED TO CART SUCCESS");
  }
};

// UPDATE CART
export const updateCart = async (productId, action) => {
  const user = getCurrentUser();

  if (!user) {
    console.log("NO USER LOGGED IN");
    return;
  }

  const { data: cartItem, error } = await supabase
    .from("cart")
    .select("*")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    console.log("SELECT ERROR:", error.message);
    return;
  }

  if (!cartItem) {
    console.log("ITEM NOT FOUND");
    return;
  }

  let qty = cartItem.quantity;

  if (action === "plus") {
    qty++;
  }

  if (action === "minus") {
    qty = Math.max(1, qty - 1);
  }

  const { error: updateError } = await supabase
    .from("cart")
    .update({ quantity: qty })
    .eq("id", cartItem.id);

  if (updateError) {
    console.log("UPDATE ERROR:", updateError.message);
  } else {
    console.log("CART UPDATED");
  }
};

// REMOVE ITEM
export const removeItem = async (productId) => {
  const user = getCurrentUser();

  if (!user) {
    console.log("NO USER LOGGED IN");
    return;
  }

  const { error } = await supabase
    .from("cart")
    .delete()
    .eq("user_id", user.id)
    .eq("product_id", productId);

  if (error) {
    console.log("REMOVE ERROR:", error.message);
  } else {
    console.log("REMOVED SUCCESS");
  }
};