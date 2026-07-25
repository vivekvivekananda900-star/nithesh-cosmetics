import { supabase } from "@/app/lib/supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function addProduct(product: any) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select();

  if (error) throw error;

  return data;
}

export async function updateProduct(id: string, product: any) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;
}