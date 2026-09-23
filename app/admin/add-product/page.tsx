"use client";

import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  PackagePlus,
  Upload,
} from "lucide-react";

import { supabase } from "@/app/lib/supabase";

export default function AddProduct() {
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

  const [image, setImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /*
  ==============================
  SELLING PRICE
  ==============================
  */

  const sellingPrice = Math.max(
    0,
    Number(mrp || 0) -
      Number(discount || 0)
  );

  /*
  ==============================
  SELECT IMAGE
  ==============================
  */

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      e.target.files?.[0];

    if (!file) {
      setImage(null);
      setImagePreview("");
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

      e.target.value = "";
      return;
    }

    /*
      Maximum image size: 10 MB
    */

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "Image must be less than 10 MB."
      );

      e.target.value = "";
      return;
    }

    setImage(file);

    const preview =
      URL.createObjectURL(file);

    setImagePreview(preview);
  }

  /*
  ==============================
  UPLOAD IMAGE
  ==============================
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
      data: uploadData,
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

    /*
      Exact Storage error
    */

    if (uploadError) {
      console.error(
        "PRODUCT IMAGE UPLOAD ERROR:",
        uploadError
      );

      throw new Error(
        `Image upload failed: ${uploadError.message}`
      );
    }

    if (!uploadData) {
      throw new Error(
        "Image upload failed: Supabase returned no upload data."
      );
    }

    /*
      Get public URL
    */

    const {
      data: publicUrlData,
    } = supabase.storage
      .from("products")
      .getPublicUrl(
        fileName
      );

    if (
      !publicUrlData?.publicUrl
    ) {
      throw new Error(
        "Image uploaded, but public URL could not be generated."
      );
    }

    return publicUrlData.publicUrl;
  }

  /*
  ==============================
  ADD PRODUCT
  ==============================
  */

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    /*
      Required validation
    */

    if (!name.trim()) {
      alert(
        "Please enter product name."
      );

      return;
    }

    if (!mrp) {
      alert(
        "Please enter product MRP."
      );

      return;
    }

    if (!category.trim()) {
      alert(
        "Please enter product category."
      );

      return;
    }

    if (!image) {
      alert(
        "Please select product image."
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

    /*
      Number validation
    */

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
      Number.isNaN(
        discountNumber
      ) ||
      discountNumber < 0
    ) {
      alert(
        "Please enter a valid discount."
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

    if (
      Number.isNaN(
        deliveryFeeNumber
      ) ||
      deliveryFeeNumber < 0
    ) {
      alert(
        "Please enter a valid delivery fee."
      );

      return;
    }

    setLoading(true);

    try {
      /*
      ==============================
      STEP 1
      UPLOAD IMAGE
      ==============================
      */

      const imageUrl =
        await uploadImage(
          image
        );

      console.log(
        "IMAGE UPLOADED:",
        imageUrl
      );

      /*
      ==============================
      STEP 2
      SAVE PRODUCT
      ==============================
      */

      const {
        data: productData,
        error: productError,
      } = await supabase
        .from("products")
        .insert([
          {
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

            image:
              imageUrl,

            deliveryfee:
              deliveryFeeNumber,

            featured:
              false,

            active:
              true,
          },
        ])
        .select();

      /*
        Exact database error
      */

      if (productError) {
        console.error(
          "PRODUCT DATABASE ERROR:",
          productError
        );

        throw new Error(
          `Product save failed: ${productError.message}`
        );
      }

      console.log(
        "PRODUCT SAVED:",
        productData
      );

      /*
      ==============================
      SUCCESS
      ==============================
      */

      alert(
        "✅ Product Added Successfully!"
      );

      /*
      Reset form
      */

      setName("");
      setMrp("");
      setDiscount("");
      setCategory("");
      setDescription("");
      setDeliveryFee("");
      setImage(null);
      setImagePreview("");

      const imageInput =
        document.getElementById(
          "product-image"
        ) as HTMLInputElement | null;

      if (imageInput) {
        imageInput.value = "";
      }
    } catch (
      error: unknown
    ) {
      console.error(
        "Add product error:",
        error
      );

      if (
        error instanceof Error
      ) {
        alert(
          error.message
        );
      } else {
        alert(
          "Failed to add product. Check browser console."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-[#fffaf5]
        via-[#fff5eb]
        to-white
        px-4
        py-8
        sm:px-6
      "
    >
      {/* Background */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            -left-28
            top-20
            h-72
            w-72
            rounded-full
            bg-orange-200/30
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-28
            top-[500px]
            h-80
            w-80
            rounded-full
            bg-rose-200/20
            blur-3xl
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-2xl
        "
      >
        <form
          onSubmit={
            handleSubmit
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
          {/* Header */}

          <div
            className="
              mb-7
              flex
              items-start
              gap-4
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-orange-50
                text-orange-600
              "
            >
              <PackagePlus
                size={27}
              />
            </div>

            <div>
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
                  mt-1
                  text-3xl
                  font-black
                  tracking-tight
                  text-gray-900
                "
              >
                Add Product
              </h1>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                Add a new product
                to your store.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Product Name */}

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
                placeholder="Enter product name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
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
                placeholder="Enter MRP"
                value={mrp}
                onChange={(e) =>
                  setMrp(
                    e.target.value
                  )
                }
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
                placeholder="Example: 50"
                value={discount}
                onChange={(e) =>
                  setDiscount(
                    e.target.value
                  )
                }
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

              {Number(
                discount || 0
              ) > 0 && (
                <p
                  className="
                    mt-1
                    text-xs
                    font-semibold
                    text-green-600
                  "
                >
                  Customer saves ₹
                  {Number(
                    discount
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>
              )}
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
                placeholder="Example: Makeup"
                value={
                  category
                }
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }
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
                placeholder="Enter product description"
                value={
                  description
                }
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={4}
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
                  transition-all
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
                placeholder="0 for free delivery"
                value={
                  deliveryFee
                }
                onChange={(e) =>
                  setDeliveryFee(
                    e.target.value
                  )
                }
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
                Product Image *
              </label>

              <label
                htmlFor="product-image"
                className="
                  flex
                  min-h-36
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border-2
                  border-dashed
                  border-orange-200
                  bg-orange-50/50
                  p-6
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
                  Choose Product Image
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  JPG, PNG, WEBP
                  • Max 10 MB
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
                id="product-image"
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />
            </div>

            {/* Image Preview */}

            {imagePreview && (
              <div
                className="
                  rounded-2xl
                  border
                  border-gray-100
                  bg-gray-50
                  p-3
                "
              >
                <p
                  className="
                    mb-3
                    text-xs
                    font-black
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Image Preview
                </p>

                <div
                  className="
                    flex
                    h-64
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
                    alt="Product preview"
                    className="
                      h-full
                      w-full
                      object-contain
                      p-3
                    "
                  />
                </div>
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
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
              {loading ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />

                  Adding Product...
                </>
              ) : (
                <>
                  <PackagePlus
                    size={19}
                  />

                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}