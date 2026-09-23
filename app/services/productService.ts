import { supabase } from "@/app/lib/supabase";

export interface Product {
  id?: string;
  name: string;
  price: number;
  mrp?: number;
  discount?: number;
  category?: string;
  description?: string;
  image?: string;
  images?: string[];
  stock?: number;
  deliveryfee?: number;
  created_at?: string;
}

/* =========================
   GET PRODUCTS
========================= */

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to load products:",
      error
    );

    throw error;
  }

  return data || [];
}

/* =========================
   ADD PRODUCT
========================= */

export async function addProduct(
  product: Omit<Product, "id" | "created_at">
) {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to add product:",
      error
    );

    throw error;
  }

  return data;
}

/* =========================
   UPDATE PRODUCT
========================= */

export async function updateProduct(
  id: string,
  product: Partial<Product>
) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to update product:",
      error
    );

    throw error;
  }

  return data;
}

/* =========================
   DELETE PRODUCT
========================= */

export async function deleteProduct(
  id: string
) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Failed to delete product:",
      error
    );

    throw error;
  }

  return true;
}