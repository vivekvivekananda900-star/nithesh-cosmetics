"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
  Upload,
} from "lucide-react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { supabase } from "@/app/lib/supabase";

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();

  const productId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [name, setName] =
    useState("");

  const [mrp, setMrp] =
    useState("");

  const [discount, setDiscount] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [deliveryFee, setDeliveryFee] =
    useState("");

  /*
  Current image saved in database
  */

  const [currentImage, setCurrentImage] =
    useState("");

  /*
  New image selected from gallery
  */

  const [newImage, setNewImage] =
    useState<File | null>(null);

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const sellingPrice = Math.max(
    0,
    Number(mrp || 0) -
      Number(discount || 0)
  );

  /*
  ========================================
  LOAD PRODUCT

  No admin login check.
  ========================================
  */

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  async function fetchProduct() {
    if (!productId) {
      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        alert(
          "Product not found."
        );

        router.push(
          "/admin/products"
        );

        return;
      }

      setName(
        data.name || ""
      );

      setMrp(
        String(
          data.mrp ?? ""
        )
      );

      setDiscount(
        String(
          data.discount ?? ""
        )
      );

      setCategory(
        data.category || ""
      );

      setDescription(
        data.description || ""
      );

      setDeliveryFee(
        String(
          data.deliveryfee ??
            data.deliveryFee ??
            ""
        )
      );

      setCurrentImage(
        data.image || ""
      );

      setImagePreview(
        data.image || ""
      );
    } catch (error) {
      console.error(
        "Fetch product error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Product not found."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  ========================================
  SELECT NEW IMAGE FROM GALLERY
  ========================================
  */

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select an image file."
      );

      return;
    }

    /*
    Maximum 10 MB
    */

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "Image must be less than 10 MB."
      );

      return;
    }

    setNewImage(file);

    const preview =
      URL.createObjectURL(file);

    setImagePreview(preview);
  }

  /*
  ========================================
  UPLOAD IMAGE TO SUPABASE STORAGE
  ========================================
  */

  async function uploadImage(
    file: File
  ) {
    const safeName =
      file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "-"
      );

    const fileName =
      `${Date.now()}-${safeName}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("products")
      .upload(
        fileName,
        file,
        {
          cacheControl:
            "3600",

          upsert:
            false,
        }
      );

    if (uploadError) {
      throw uploadError;
    }

    const { data } =
      supabase.storage
        .from("products")
        .getPublicUrl(
          fileName
        );

    return data.publicUrl;
  }

  /*
  ========================================
  UPDATE PRODUCT
  ========================================
  */

  async function updateProduct(
    e?: FormEvent<HTMLFormElement>
  ) {
    e?.preventDefault();

    if (!productId) {
      alert(
        "Product ID missing."
      );

      return;
    }

    if (!name.trim()) {
      alert(
        "Please enter product name."
      );

      return;
    }

    if (!mrp) {
      alert(
        "Please enter MRP."
      );

      return;
    }

    if (!category.trim()) {
      alert(
        "Please enter category."
      );

      return;
    }

    const mrpNumber =
      Number(mrp);

    const discountNumber =
      Number(
        discount || 0
      );

    const deliveryFeeNumber =
      Number(
        deliveryFee || 0
      );

    if (
      Number.isNaN(
        mrpNumber
      ) ||
      mrpNumber <= 0
    ) {
      alert(
        "Please enter a valid MRP."
      );

      return;
    }

    if (
      discountNumber < 0
    ) {
      alert(
        "Discount cannot be negative."
      );

      return;
    }

    if (
      discountNumber >
      mrpNumber
    ) {
      alert(
        "Discount cannot be greater than MRP."
      );

      return;
    }

    setSaving(true);

    try {
      /*
      Start with existing image
      */

      let finalImageUrl =
        currentImage;

      /*
      If admin selected a new image,
      upload it and replace URL.
      */

      if (newImage) {
        finalImageUrl =
          await uploadImage(
            newImage
          );
      }

      const {
        error,
      } = await supabase
        .from("products")
        .update({
          name:
            name.trim(),

          mrp:
            mrpNumber,

          discount:
            discountNumber,

          price:
            sellingPrice,

          category:
            category.trim(),

          description:
            description.trim(),

          deliveryfee:
            deliveryFeeNumber,

          image:
            finalImageUrl,
        })
        .eq(
          "id",
          productId
        );

      if (error) {
        throw error;
      }

      alert(
        "✅ Product Updated Successfully!"
      );

      router.push(
        "/admin/products"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Update product error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  ========================================
  LOADING SCREEN
  ========================================
  */

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#fffaf5]
        "
      >
        <div className="text-center">
          <Loader2
            size={36}
            className="
              mx-auto
              animate-spin
              text-orange-500
            "
          />

          <p
            className="
              mt-3
              font-bold
              text-gray-700
            "
          >
            Loading Product...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#fffaf5]
        via-[#fff5eb]
        to-white
        px-4
        py-8
      "
    >
      <div
        className="
          mx-auto
          max-w-2xl
        "
      >
        {/* Back */}

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/products"
            )
          }
          className="
            mb-5
            flex
            items-center
            gap-2
            rounded-xl
            bg-white
            px-4
            py-2.5
            text-sm
            font-bold
            text-gray-700
            shadow-sm
            transition
            hover:text-orange-600
          "
        >
          <ArrowLeft
            size={18}
          />

          Products
        </button>

        <form
          onSubmit={
            updateProduct
          }
          className="
            rounded-[30px]
            border
            border-orange-100
            bg-white
            p-5
            shadow-[0_20px_60px_rgba(15,23,42,0.08)]
            sm:p-8
          "
        >
          {/* Heading */}

          <div className="mb-7">
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                text-orange-500
              "
            >
              Nithesh Cosmetics
            </p>

            <h1
              className="
                mt-2
                text-3xl
                font-black
                tracking-tight
                text-gray-900
              "
            >
              Edit Product
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              Update product
              details or choose
              a new image from
              gallery.
            </p>
          </div>

          <div className="space-y-5">
            {/* Name */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-gray-700
                "
              >
                Product Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Product Name"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3.5
                  outline-none
                  transition-all
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                "
              />
            </div>

            {/* MRP */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-gray-700
                "
              >
                MRP *
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={mrp}
                onChange={(e) =>
                  setMrp(
                    e.target.value
                  )
                }
                placeholder="MRP"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3.5
                  outline-none
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                "
              />
            </div>

            {/* Discount */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-gray-700
                "
              >
                Discount Amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={discount}
                onChange={(e) =>
                  setDiscount(
                    e.target.value
                  )
                }
                placeholder="Discount"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3.5
                  outline-none
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                "
              />
            </div>

            {/* Selling Price */}

            <div
              className="
                rounded-2xl
                border
                border-orange-100
                bg-orange-50
                p-4
              "
            >
              <p
                className="
                  text-xs
                  font-bold
                  text-gray-500
                "
              >
                Selling Price
              </p>

              <p
                className="
                  mt-1
                  text-2xl
                  font-black
                  text-orange-600
                "
              >
                ₹
                {sellingPrice.toLocaleString(
                  "en-IN"
                )}
              </p>
            </div>

            {/* Category */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-gray-700
                "
              >
                Category *
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
                placeholder="Category"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3.5
                  outline-none
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                "
              />
            </div>

            {/* Description */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-gray-700
                "
              >
                Description
              </label>

              <textarea
                value={
                  description
                }
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Description"
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3.5
                  outline-none
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                "
              />
            </div>

            {/* Delivery Fee */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-gray-700
                "
              >
                Delivery Fee
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={
                  deliveryFee
                }
                onChange={(e) =>
                  setDeliveryFee(
                    e.target.value
                  )
                }
                placeholder="0 for free delivery"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3.5
                  outline-none
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                "
              />
            </div>

            {/* Image */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                  text-gray-700
                "
              >
                Product Image
              </label>

              {/* Preview */}

              {imagePreview && (
                <div
                  className="
                    mb-4
                    overflow-hidden
                    rounded-2xl
                    border
                    border-gray-100
                    bg-gray-50
                    p-3
                  "
                >
                  <div
                    className="
                      flex
                      h-60
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-xl
                      bg-white
                    "
                  >
                    <img
                      src={
                        imagePreview
                      }
                      alt={
                        name ||
                        "Product"
                      }
                      className="
                        h-full
                        w-full
                        object-contain
                        p-3
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-2
                      text-center
                      text-xs
                      text-gray-500
                    "
                  >
                    {newImage
                      ? "New image selected"
                      : "Current product image"}
                  </p>
                </div>
              )}

              {/* Gallery button */}

              <label
                htmlFor="edit-product-image"
                className="
                  flex
                  min-h-32
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-dashed
                  border-orange-200
                  bg-orange-50/50
                  px-4
                  py-6
                  text-center
                  transition-all
                  hover:border-orange-400
                  hover:bg-orange-50
                "
              >
                <ImagePlus
                  size={30}
                  className="
                    text-orange-500
                  "
                />

                <p
                  className="
                    mt-3
                    text-sm
                    font-black
                    text-gray-800
                  "
                >
                  Choose New Image
                  From Gallery
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  Leave unchanged
                  to keep current
                  image
                </p>

                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-4
                    py-2
                    text-xs
                    font-bold
                    text-orange-600
                    shadow-sm
                  "
                >
                  <Upload
                    size={15}
                  />

                  Select Image
                </div>
              </label>

              <input
                id="edit-product-image"
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />
            </div>

            {/* Save */}

            <button
              type="submit"
              disabled={saving}
              className="
                flex
                min-h-14
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-gradient-to-r
                from-orange-500
                to-orange-600
                px-6
                py-4
                text-base
                font-black
                text-white
                shadow-[0_12px_30px_rgba(249,115,22,0.28)]
                transition-all
                hover:-translate-y-0.5
                active:scale-[0.98]
                disabled:pointer-events-none
                disabled:opacity-60
              "
            >
              {saving ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save
                    size={19}
                  />

                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}