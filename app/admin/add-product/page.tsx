"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function AddProduct() {

  const [name, setName] = useState("");
  const [mrp, setMrp] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const sellingPrice =
    Number(mrp || 0) - Number(discount || 0);
    const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  if (!name || !mrp || !category) {
    alert("Please fill all required fields.");
    return;
  }

  setLoading(true);
  const {
  data: { user },
} = await supabase.auth.getUser();

alert(JSON.stringify(user, null, 2));

  try {
    let imageUrl = "";

    if (image) {
      imageUrl = await uploadImage(image);
    }

    const { error } = await supabase
      .from("products")
      .insert([
        {
          name,
          mrp: Number(mrp),
          discount: Number(discount || 0),
          price: sellingPrice,
          category,
          description,
          image: imageUrl,
          deliveryfee: Number(deliveryFee || 0),
          featured: false,
          active: true,
        },
      ]);

    if (error) {
      throw error;
    }

    alert("✅ Product Added Successfully!");

    setName("");
    setMrp("");
    setDiscount("");
    setCategory("");
    setDescription("");
    setDeliveryFee("");
    setImage(null);
  } catch (error: any) {
    console.error(error);
    alert(error.message || "Failed to add product");
  } finally {
    setLoading(false);
  }
};
async function uploadImage(file: File) {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("products")
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("products")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-5">
        Add Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Product Name *"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          placeholder="MRP *"
          value={mrp}
          onChange={(e)=>setMrp(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          placeholder="Discount Amount"
          value={discount}
          onChange={(e)=>setDiscount(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <div className="bg-orange-50 p-3 rounded">
          Selling Price:
          <b> ₹{sellingPrice}</b>
        </div>

        <input
          type="text"
          placeholder="Category *"
          value={category}
          onChange={(e)=>setCategory(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          placeholder="Delivery Fee"
          value={deliveryFee}
          onChange={(e)=>setDeliveryFee(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e)=>
            setImage(e.target.files?.[0] || null)
          }
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white p-3 rounded-lg font-bold"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>

      </form>
    </div>
  );
}