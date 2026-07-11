"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [mrp, setMrp] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  const sellingPrice =
    Number(mrp || 0) - Number(discount || 0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const docRef = doc(db, "products", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setName(data.name || "");
        setMrp(String(data.mrp || ""));
        setDiscount(String(data.discount || ""));
        setCategory(data.category || "");
        setDescription(data.description || "");
        setImage(data.image || "");
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <form className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Edit Product
        </h1>

        <input
          type="text"
          placeholder="Product Name"
          className="w-full border p-3 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="MRP"
          className="w-full border p-3 rounded mb-4"
          value={mrp}
          onChange={(e) => setMrp(e.target.value)}
        />

        <input
          type="number"
          placeholder="Discount"
          className="w-full border p-3 rounded mb-4"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />

        <input
          type="number"
          value={sellingPrice}
          readOnly
          className="w-full border p-3 rounded mb-4 bg-gray-100"
        />

        <input
          type="text"
          placeholder="Category"
          className="w-full border p-3 rounded mb-4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-3 rounded mb-4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Image URL"
          className="w-full border p-3 rounded mb-6"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button
          type="button"
          onClick={async () => {
            try {
              await updateDoc(doc(db, "products", id as string), {
                name,
                mrp: Number(mrp),
                discount: Number(discount),
                price: sellingPrice,
                category,
                description,
                image,
              });

              alert("✅ Product Updated Successfully!");
              router.push("/admin/products");
            } catch (error) {
              console.error(error);
              alert("❌ Failed to update product");
            }
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          💾 Save Changes
        </button>
      </form>
    </main>
  );
}