"use client";

import {
  ChangeEvent,
  useEffect,
  useState,
} from "react";

import {
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";

/*
====================================
BANNER TYPE
====================================
*/

type Banner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  created_at?: string;
};

type ApiResult = {
  success?: boolean;
  error?: string;
  banners?: Banner[];
  banner?: Banner;
};

/*
====================================
PAGE
====================================
*/

export default function BannerAdminPage() {
  const [
    banners,
    setBanners,
  ] =
    useState<Banner[]>(
      []
    );

  const [
    title,
    setTitle,
  ] =
    useState("");

  const [
    subtitle,
    setSubtitle,
  ] =
    useState("");

  const [
    imageFile,
    setImageFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    imagePreview,
    setImagePreview,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    adding,
    setAdding,
  ] =
    useState(false);

  const [
    deletingId,
    setDeletingId,
  ] =
    useState<
      string | null
    >(null);

  const [
    editingId,
    setEditingId,
  ] =
    useState<
      string | null
    >(null);

  /*
  ==================================
  SAFE API RESPONSE
  ==================================
  */

  async function readResponse(
    response: Response
  ): Promise<ApiResult> {
    const text =
      await response.text();

    if (!text) {
      return {};
    }

    try {
      return JSON.parse(
        text
      ) as ApiResult;
    } catch {
      throw new Error(
        `Server returned an invalid response. Status: ${response.status}`
      );
    }
  }

  /*
  ==================================
  LOAD BANNERS
  ==================================
  */

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/admin/banner",
          {
            method:
              "GET",

            cache:
              "no-store",
          }
        );

      const result =
        await readResponse(
          response
        );

      if (
        !response.ok
      ) {
        throw new Error(
          result.error ||
            "Failed to load banners."
        );
      }

      setBanners(
        result.banners ||
          []
      );
    } catch (error) {
      console.error(
        "Load banners error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  ==================================
  SELECT IMAGE
  ==================================
  */

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select a valid image."
      );

      event.target.value =
        "";

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "Image must be less than 10 MB."
      );

      event.target.value =
        "";

      return;
    }

    if (
      imagePreview
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImageFile(
      file
    );

    const preview =
      URL.createObjectURL(
        file
      );

    setImagePreview(
      preview
    );
  }

  /*
  ==================================
  CLEAR FORM
  ==================================
  */

  function clearForm() {
    setTitle("");
    setSubtitle("");
    setImageFile(
      null
    );

    if (
      imagePreview
    ) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setImagePreview(
      ""
    );

    const input =
      document.getElementById(
        "banner-image"
      ) as HTMLInputElement | null;

    if (input) {
      input.value =
        "";
    }
  }

  /*
  ==================================
  ADD BANNER
  ==================================
  */

  async function addBanner() {
    if (
      !title.trim()
    ) {
      alert(
        "Please enter banner title."
      );

      return;
    }

    if (
      !subtitle.trim()
    ) {
      alert(
        "Please enter banner subtitle."
      );

      return;
    }

    if (
      !imageFile
    ) {
      alert(
        "Please select banner image."
      );

      return;
    }

    setAdding(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "subtitle",
        subtitle.trim()
      );

      formData.append(
        "image",
        imageFile
      );

      const response =
        await fetch(
          "/api/admin/banner",
          {
            method:
              "POST",

            body:
              formData,
          }
        );

      const result =
        await readResponse(
          response
        );

      if (
        !response.ok
      ) {
        throw new Error(
          result.error ||
            "Failed to add banner."
        );
      }

      alert(
        "✅ Banner Added Successfully!"
      );

      clearForm();

      await loadBanners();
    } catch (error) {
      console.error(
        "Add banner error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to add banner."
      );
    } finally {
      setAdding(false);
    }
  }

  /*
  ==================================
  EDIT BANNER
  ==================================
  */

  async function editBanner(
    banner: Banner
  ) {
    const newTitle =
      window.prompt(
        "Enter new banner title",
        banner.title
      );

    if (
      newTitle === null
    ) {
      return;
    }

    const newSubtitle =
      window.prompt(
        "Enter new banner subtitle",
        banner.subtitle
      );

    if (
      newSubtitle ===
      null
    ) {
      return;
    }

    if (
      !newTitle.trim()
    ) {
      alert(
        "Banner title cannot be empty."
      );

      return;
    }

    if (
      !newSubtitle.trim()
    ) {
      alert(
        "Banner subtitle cannot be empty."
      );

      return;
    }

    setEditingId(
      banner.id
    );

    try {
      const response =
        await fetch(
          "/api/admin/banner",
          {
            method:
              "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  id:
                    banner.id,

                  title:
                    newTitle.trim(),

                  subtitle:
                    newSubtitle.trim(),
                }
              ),
          }
        );

      const result =
        await readResponse(
          response
        );

      if (
        !response.ok
      ) {
        throw new Error(
          result.error ||
            "Failed to update banner."
        );
      }

      alert(
        "✅ Banner Updated Successfully!"
      );

      await loadBanners();
    } catch (error) {
      console.error(
        "Edit banner error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to edit banner."
      );
    } finally {
      setEditingId(
        null
      );
    }
  }

  /*
  ==================================
  DELETE BANNER
  ==================================
  */

  async function deleteBanner(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this banner?"
      );

    if (
      !confirmed
    ) {
      return;
    }

    setDeletingId(
      id
    );

    try {
      const response =
        await fetch(
          "/api/admin/banner",
          {
            method:
              "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  id,
                }
              ),
          }
        );

      const result =
        await readResponse(
          response
        );

      if (
        !response.ok
      ) {
        throw new Error(
          result.error ||
            "Failed to delete banner."
        );
      }

      setBanners(
        (
          current
        ) =>
          current.filter(
            (
              banner
            ) =>
              banner.id !==
              id
          )
      );

      alert(
        "✅ Banner Deleted Successfully!"
      );
    } catch (error) {
      console.error(
        "Delete banner error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete banner."
      );
    } finally {
      setDeletingId(
        null
      );
    }
  }

  /*
  ==================================
  LOADING
  ==================================
  */

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-gradient-to-br
          from-[#fffaf5]
          via-[#fff5eb]
          to-white
        "
      >
        <div
          className="
            text-center
          "
        >
          <Loader2
            size={40}
            className="
              mx-auto
              animate-spin
              text-orange-500
            "
          />

          <p
            className="
              mt-4
              font-bold
              text-gray-700
            "
          >
            Loading Banners...
          </p>
        </div>
      </main>
    );
  }

  /*
  ==================================
  PAGE
  ==================================
  */

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
        sm:px-6
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
        "
      >
        {/* HEADER */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
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
                sm:text-4xl
              "
            >
              Banner Management
            </h1>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                leading-6
                text-gray-500
              "
            >
              Add, edit and delete
              homepage promotional
              banners directly.
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadBanners
            }
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              gap-2
              rounded-2xl
              border
              border-orange-100
              bg-white
              px-4
              py-2.5
              text-sm
              font-black
              text-orange-600
              shadow-sm
              transition-all
              hover:-translate-y-0.5
              hover:bg-orange-50
            "
          >
            <RefreshCw
              size={17}
            />

            Refresh
          </button>
        </div>

        {/* ADD BANNER */}

        <section
          className="
            max-w-2xl
            rounded-[30px]
            border
            border-orange-100
            bg-white
            p-5
            shadow-[0_15px_50px_rgba(15,23,42,0.07)]
            sm:p-7
          "
        >
          <div
            className="
              mb-6
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-orange-50
                text-orange-600
              "
            >
              <ImagePlus
                size={23}
              />
            </div>

            <div>
              <h2
                className="
                  text-xl
                  font-black
                  text-gray-900
                "
              >
                Add New Banner
              </h2>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                "
              >
                Select image
                directly from
                your gallery.
              </p>
            </div>
          </div>

          <div
            className="
              space-y-4
            "
          >
            {/* TITLE */}

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
                Banner Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(
                  event
                ) =>
                  setTitle(
                    event.target
                      .value
                  )
                }
                placeholder="Enter banner title"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3.5
                  text-gray-900
                  outline-none
                  transition-all
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                "
              />
            </div>

            {/* SUBTITLE */}

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
                Banner Subtitle
              </label>

              <input
                type="text"
                value={
                  subtitle
                }
                onChange={(
                  event
                ) =>
                  setSubtitle(
                    event.target
                      .value
                  )
                }
                placeholder="Enter banner subtitle"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-4
                  py-3.5
                  text-gray-900
                  outline-none
                  transition-all
                  focus:border-orange-400
                  focus:bg-white
                  focus:ring-4
                  focus:ring-orange-100
                "
              />
            </div>

            {/* IMAGE */}

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
                Banner Image
              </label>

              <label
                htmlFor="banner-image"
                className="
                  flex
                  min-h-40
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
                <Upload
                  size={31}
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
                  Choose Image From Gallery
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    text-gray-500
                  "
                >
                  JPG, PNG or WEBP
                  • Maximum 10 MB
                </p>
              </label>

              <input
                id="banner-image"
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />
            </div>

            {/* PREVIEW */}

            {imagePreview && (
              <div
                className="
                  overflow-hidden
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
                  Banner Preview
                </p>

                <img
                  src={
                    imagePreview
                  }
                  alt="Banner Preview"
                  className="
                    h-48
                    w-full
                    rounded-xl
                    object-cover
                    sm:h-64
                  "
                />
              </div>
            )}

            {/* ADD BUTTON */}

            <button
              type="button"
              disabled={
                adding
              }
              onClick={
                addBanner
              }
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
              {adding ? (
                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />

                  Uploading...
                </>
              ) : (
                <>
                  <Plus
                    size={19}
                  />

                  Add Banner
                </>
              )}
            </button>
          </div>
        </section>

        {/* EXISTING TITLE */}

        <div
          className="
            mt-10
          "
        >
          <h2
            className="
              text-2xl
              font-black
              text-gray-900
            "
          >
            Existing Banners
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            {banners.length}{" "}
            banner
            {banners.length ===
            1
              ? ""
              : "s"}{" "}
            available
          </p>
        </div>

        {/* BANNERS */}

        <div
          className="
            mt-6
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {banners.map(
            (
              banner
            ) => (
              <article
                key={
                  banner.id
                }
                className="
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-gray-100
                  bg-white
                  shadow-[0_12px_35px_rgba(15,23,42,0.07)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                "
              >
                <img
                  src={
                    banner.image
                  }
                  alt={
                    banner.title
                  }
                  className="
                    h-48
                    w-full
                    object-cover
                  "
                />

                <div
                  className="
                    p-5
                  "
                >
                  <h3
                    className="
                      text-lg
                      font-black
                      text-gray-900
                    "
                  >
                    {
                      banner.title
                    }
                  </h3>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-6
                      text-gray-500
                    "
                  >
                    {
                      banner.subtitle
                    }
                  </p>

                  <div
                    className="
                      mt-5
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >
                    <button
                      type="button"
                      disabled={
                        editingId ===
                        banner.id
                      }
                      onClick={() =>
                        editBanner(
                          banner
                        )
                      }
                      className="
                        flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-50
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-blue-700
                        hover:bg-blue-100
                        disabled:opacity-50
                      "
                    >
                      {editingId ===
                      banner.id ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Pencil
                          size={16}
                        />
                      )}

                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        banner.id
                      }
                      onClick={() =>
                        deleteBanner(
                          banner.id
                        )
                      }
                      className="
                        flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-red-50
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                        text-red-600
                        hover:bg-red-100
                        disabled:opacity-50
                      "
                    >
                      {deletingId ===
                      banner.id ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2
                          size={16}
                        />
                      )}

                      Delete
                    </button>
                  </div>
                </div>
              </article>
            )
          )}
        </div>

        {/* EMPTY */}

        {banners.length ===
          0 && (
          <div
            className="
              mt-8
              rounded-[28px]
              border
              border-dashed
              border-gray-200
              bg-white
              p-10
              text-center
            "
          >
            <ImagePlus
              size={44}
              className="
                mx-auto
                text-gray-300
              "
            />

            <h2
              className="
                mt-4
                text-xl
                font-black
                text-gray-800
              "
            >
              No Banners Yet
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              Add your first
              homepage banner
              above.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}