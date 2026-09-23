"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  LogOut,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { supabase } from "@/app/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();

  const [userId, setUserId] =
    useState("");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [latitude, setLatitude] =
    useState<number | null>(null);

  const [longitude, setLongitude] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    locationLoading,
    setLocationLoading,
  ] = useState(false);

  const [saved, setSaved] =
    useState(false);

  /* =========================
     LOAD PROFILE
  ========================= */

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        router.replace(
          "/login"
        );

        return;
      }

      setUserId(user.id);

      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq(
          "uuid",
          user.id
        )
        .maybeSingle();

      if (error) {
        console.error(
          "Profile loading error:",
          error
        );
      }

      if (data) {
        setName(
          data.name || ""
        );

        setEmail(
          data.email ||
            user.email ||
            ""
        );

        setPhone(
          data.phone || ""
        );

        setAddress(
          data.address || ""
        );

        setLatitude(
          data.latitude !==
            null &&
            data.latitude !==
              undefined
            ? Number(
                data.latitude
              )
            : null
        );

        setLongitude(
          data.longitude !==
            null &&
            data.longitude !==
              undefined
            ? Number(
                data.longitude
              )
            : null
        );
      } else {
        setEmail(
          user.email || ""
        );

        setName(
          user.user_metadata
            ?.name || ""
        );
      }
    } catch (error) {
      console.error(
        "Profile error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     CURRENT LOCATION
  ========================= */

  function getCurrentLocation() {
    if (
      !navigator.geolocation
    ) {
      alert(
        "Location is not supported on this device."
      );

      return;
    }

    if (!userId) {
      alert(
        "Please login again."
      );

      return;
    }

    setLocationLoading(
      true
    );

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat =
            position.coords
              .latitude;

          const lng =
            position.coords
              .longitude;

          const mapLink = `https://maps.google.com/?q=${lat},${lng}`;

          setLatitude(lat);
          setLongitude(lng);

          const { error } =
            await supabase
              .from(
                "profiles"
              )
              .update({
                latitude:
                  lat,
                longitude:
                  lng,
                location:
                  mapLink,
              })
              .eq(
                "uuid",
                userId
              );

          if (error) {
            throw error;
          }

          alert(
            "📍 Location saved successfully"
          );
        } catch (error) {
          console.error(
            "Location saving error:",
            error
          );

          alert(
            "Failed to save location"
          );
        } finally {
          setLocationLoading(
            false
          );
        }
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        setLocationLoading(
          false
        );

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          alert(
            "Please allow location permission."
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          alert(
            "Your location is unavailable."
          );
        } else if (
          error.code ===
          error.TIMEOUT
        ) {
          alert(
            "Location request timed out. Please try again."
          );
        } else {
          alert(
            "Unable to get your location."
          );
        }
      },

      {
        enableHighAccuracy:
          true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  /* =========================
     SAVE PROFILE
  ========================= */

  async function saveProfile() {
    if (
      phone.length !== 10
    ) {
      alert(
        "Enter valid 10 digit phone number"
      );

      return;
    }

    if (
      !address.trim()
    ) {
      alert(
        "Please enter your delivery address"
      );

      return;
    }

    if (!userId) {
      alert(
        "Please login again."
      );

      return;
    }

    try {
      setSaving(true);
      setSaved(false);

      const { error } =
        await supabase
          .from("profiles")
          .update({
            phone,
            address:
              address.trim(),
            latitude,
            longitude,
          })
          .eq(
            "uuid",
            userId
          );

      if (error) {
        throw error;
      }

      setSaved(true);

      window.setTimeout(
        () => {
          setSaved(false);
        },
        1800
      );

      alert(
        "✅ Profile updated"
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      alert(
        "Update failed"
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     LOGOUT
  ========================= */

  async function logout() {
    try {
      await supabase.auth.signOut();

      router.replace(
        "/login"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      alert(
        "Logout failed"
      );
    }
  }

  /* =========================
     LOADING
  ========================= */

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
          via-white
          to-[#fff1e8]
          px-4
        "
      >
        <div className="text-center">
          <div
            className="
              relative
              mx-auto
              h-16
              w-16
            "
          >
            <div
              className="
                absolute
                inset-0
                rounded-full
                border-4
                border-orange-100
              "
            />

            <div
              className="
                absolute
                inset-0
                animate-spin
                rounded-full
                border-4
                border-transparent
                border-t-orange-500
              "
            />

            <User
              size={23}
              className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                text-orange-500
              "
            />
          </div>

          <p
            className="
              mt-4
              text-sm
              font-bold
              text-gray-500
            "
          >
            Loading your
            profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gradient-to-br
        from-[#fffaf5]
        via-[#fff7f0]
        to-white
        pb-28
      "
    >
      {/* Background */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            -left-32
            top-20
            h-80
            w-80
            rounded-full
            bg-orange-200/30
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-32
            top-[500px]
            h-96
            w-96
            rounded-full
            bg-rose-200/20
            blur-3xl
          "
        />
      </div>

      {/* =========================
          HEADER
      ========================= */}

      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-gray-100/80
          bg-white/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-3xl
            items-center
            gap-3
            px-4
            py-4
            sm:px-6
          "
        >
          <button
            type="button"
            onClick={() =>
              router.back()
            }
            aria-label="Go back"
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-gray-200
              bg-white
              text-gray-700
              shadow-sm
              transition-all
              hover:border-orange-200
              hover:bg-orange-50
              hover:text-orange-600
              active:scale-95
            "
          >
            <ArrowLeft
              size={21}
            />
          </button>

          <div>
            <p
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-orange-500
                sm:text-xs
              "
            >
              Nithesh
              Cosmetics
            </p>

            <h1
              className="
                text-xl
                font-black
                tracking-tight
                text-gray-900
                sm:text-2xl
              "
            >
              My Profile
            </h1>
          </div>

          <div
            className="
              ml-auto
              hidden
              items-center
              gap-2
              rounded-full
              bg-green-50
              px-3
              py-2
              text-xs
              font-bold
              text-green-700
              sm:flex
            "
          >
            <ShieldCheck
              size={15}
            />

            Secure Profile
          </div>
        </div>
      </header>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-3xl
          px-3
          py-6
          sm:px-6
          sm:py-9
        "
      >
        {/* =========================
            PROFILE HERO
        ========================= */}

        <section
          className="
            relative
            overflow-hidden
            rounded-[30px]
            bg-gradient-to-br
            from-orange-500
            via-orange-500
            to-amber-400
            p-5
            text-white
            shadow-[0_20px_55px_rgba(249,115,22,0.25)]
            sm:p-7
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-14
              -top-14
              h-48
              w-48
              rounded-full
              bg-white/10
              blur-xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              -left-10
              h-52
              w-52
              rounded-full
              bg-yellow-200/15
              blur-2xl
            "
          />

          <div
            className="
              relative
              z-10
            "
          >
            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/20
                  bg-white/10
                  px-3
                  py-1.5
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.14em]
                  backdrop-blur-md
                "
              >
                <Sparkles
                  size={13}
                />

                Customer Profile
              </div>

              <ShieldCheck
                size={21}
              />
            </div>

            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              <div
                className="
                  flex
                  h-20
                  w-20
                  shrink-0
                  items-center
                  justify-center
                  rounded-[24px]
                  border
                  border-white/25
                  bg-white/15
                  backdrop-blur-xl
                  sm:h-24
                  sm:w-24
                  sm:rounded-[28px]
                "
              >
                <User
                  size={40}
                  strokeWidth={
                    1.8
                  }
                />
              </div>

              <div
                className="
                  min-w-0
                  flex-1
                "
              >
                <p
                  className="
                    text-xs
                    text-white/75
                  "
                >
                  Welcome
                </p>

                <h2
                  className="
                    mt-1
                    truncate
                    text-xl
                    font-black
                    sm:text-2xl
                  "
                >
                  {name ||
                    "Customer"}
                </h2>

                <p
                  className="
                    mt-1
                    truncate
                    text-xs
                    text-white/85
                    sm:text-sm
                  "
                >
                  {email}
                </p>

                {phone && (
                  <p
                    className="
                      mt-1
                      text-xs
                      text-white/85
                      sm:text-sm
                    "
                  >
                    +91 {phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            ACCOUNT DETAILS
        ========================= */}

        <section
          className="
            mt-5
            rounded-[30px]
            border
            border-gray-100
            bg-white
            p-5
            shadow-[0_14px_45px_rgba(15,23,42,0.06)]
            sm:p-7
          "
        >
          <div className="mb-6">
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.16em]
                text-orange-500
              "
            >
              Personal
              Information
            </p>

            <h2
              className="
                mt-1
                text-xl
                font-black
                tracking-tight
                text-gray-900
                sm:text-2xl
              "
            >
              Account Details
            </h2>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-gray-500
                sm:text-sm
              "
            >
              Keep your delivery
              information updated.
            </p>
          </div>

          <div className="space-y-5">
            {/* Name */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-gray-600
                "
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  value={name}
                  disabled
                  className="
                    w-full
                    cursor-not-allowed
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-100
                    py-4
                    pl-12
                    pr-4
                    text-sm
                    font-semibold
                    text-gray-600
                    outline-none
                    sm:text-base
                  "
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-gray-600
                "
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  value={email}
                  disabled
                  className="
                    w-full
                    cursor-not-allowed
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-100
                    py-4
                    pl-12
                    pr-4
                    text-sm
                    font-semibold
                    text-gray-600
                    outline-none
                    sm:text-base
                  "
                />
              </div>
            </div>

            {/* Phone */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-gray-600
                "
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(
                          0,
                          10
                        )
                    )
                  }
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter 10 digit phone number"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-4
                    pl-12
                    pr-4
                    text-sm
                    outline-none
                    transition-all
                    placeholder:text-gray-400
                    hover:border-orange-200
                    focus:border-orange-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-orange-100
                    sm:text-base
                  "
                />
              </div>

              <div
                className="
                  mt-2
                  flex
                  justify-between
                  px-1
                  text-[10px]
                "
              >
                <span
                  className="
                    text-gray-400
                  "
                >
                  Used for delivery
                  updates
                </span>

                <span
                  className={
                    phone.length ===
                    10
                      ? "font-bold text-green-600"
                      : "font-bold text-gray-400"
                  }
                >
                  {phone.length}
                  /10
                </span>
              </div>
            </div>

            {/* Address */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-xs
                  font-bold
                  uppercase
                  tracking-wide
                  text-gray-600
                "
              >
                Delivery Address
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="
                    absolute
                    left-4
                    top-4
                    text-gray-400
                  "
                />

                <textarea
                  value={
                    address
                  }
                  onChange={(e) =>
                    setAddress(
                      e.target
                        .value
                    )
                  }
                  placeholder="House number, street, area, city..."
                  className="
                    min-h-32
                    w-full
                    resize-none
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-4
                    pl-12
                    pr-4
                    text-sm
                    leading-6
                    outline-none
                    transition-all
                    placeholder:text-gray-400
                    hover:border-orange-200
                    focus:border-orange-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-orange-100
                    sm:text-base
                  "
                />
              </div>
            </div>
          </div>

          {/* =========================
              LOCATION
          ========================= */}

          <div
            className="
              mt-7
              border-t
              border-gray-100
              pt-6
            "
          >
            <div
              className="
                mb-4
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-50
                  text-blue-600
                "
              >
                <Navigation
                  size={20}
                />
              </div>

              <div>
                <h3
                  className="
                    font-black
                    text-gray-900
                  "
                >
                  Current Location
                </h3>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-gray-500
                  "
                >
                  Save your GPS
                  location for
                  easier delivery
                </p>
              </div>
            </div>

            {latitude !== null &&
              longitude !==
                null && (
                <div
                  className="
                    mb-4
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-green-100
                    bg-green-50
                    p-3
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      text-green-600
                    "
                  >
                    <Check
                      size={17}
                    />
                  </div>

                  <div
                    className="
                      min-w-0
                    "
                  >
                    <p
                      className="
                        text-xs
                        font-bold
                        text-green-700
                      "
                    >
                      Location Saved
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[10px]
                        text-green-600
                      "
                    >
                      {latitude.toFixed(
                        5
                      )}
                      ,{" "}
                      {longitude.toFixed(
                        5
                      )}
                    </p>
                  </div>
                </div>
              )}

            <button
              type="button"
              onClick={
                getCurrentLocation
              }
              disabled={
                locationLoading
              }
              className="
                flex
                min-h-14
                w-full
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-blue-100
                bg-blue-50
                px-5
                py-4
                font-bold
                text-blue-700
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:bg-blue-100
                active:scale-[0.98]
                disabled:pointer-events-none
                disabled:opacity-60
              "
            >
              {locationLoading ? (
                <>
                  <span
                    className="
                      h-5
                      w-5
                      animate-spin
                      rounded-full
                      border-2
                      border-blue-300
                      border-t-blue-700
                    "
                  />

                  Getting
                  Location...
                </>
              ) : (
                <>
                  <MapPin
                    size={19}
                  />

                  Use Current
                  Location
                </>
              )}
            </button>
          </div>

          {/* SAVE */}

          <button
            type="button"
            onClick={
              saveProfile
            }
            disabled={saving}
            className="
              group
              relative
              mt-6
              flex
              min-h-14
              w-full
              items-center
              justify-center
              gap-2
              overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-orange-500
              to-orange-600
              px-6
              py-4
              font-black
              text-white
              shadow-[0_14px_35px_rgba(249,115,22,0.28)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_18px_42px_rgba(249,115,22,0.35)]
              active:scale-[0.98]
              disabled:pointer-events-none
              disabled:opacity-60
            "
          >
            <span
              className="
                absolute
                inset-y-0
                -left-20
                w-16
                rotate-12
                bg-white/20
                blur-md
                transition-all
                duration-700
                group-hover:left-[120%]
              "
            />

            {saving ? (
              <>
                <span
                  className="
                    h-5
                    w-5
                    animate-spin
                    rounded-full
                    border-2
                    border-white/40
                    border-t-white
                  "
                />

                Saving
                Profile...
              </>
            ) : saved ? (
              <>
                <Check
                  size={19}
                  strokeWidth={3}
                />

                Profile Saved
              </>
            ) : (
              <>
                <Save
                  size={19}
                />

                Save Profile
              </>
            )}
          </button>
        </section>

        {/* =========================
            LOGOUT
        ========================= */}

        <button
          type="button"
          onClick={logout}
          className="
            mt-5
            flex
            min-h-14
            w-full
            items-center
            justify-between
            rounded-[22px]
            border
            border-red-100
            bg-white
            px-4
            py-3
            text-red-500
            shadow-[0_8px_28px_rgba(15,23,42,0.04)]
            transition-all
            duration-300
            hover:border-red-200
            hover:bg-red-50
            active:scale-[0.99]
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-2xl
                bg-red-50
              "
            >
              <LogOut
                size={18}
              />
            </div>

            <div className="text-left">
              <p
                className="
                  text-sm
                  font-black
                "
              >
                Logout
              </p>

              <p
                className="
                  mt-0.5
                  text-[10px]
                  text-red-400
                "
              >
                Sign out from
                your account
              </p>
            </div>
          </div>

          <span className="text-lg">
            →
          </span>
        </button>

        <p
          className="
            mt-7
            text-center
            text-[10px]
            font-medium
            text-gray-400
          "
        >
          Nithesh Cosmetics •
          Secure Customer Profile
        </p>
      </div>
    </main>
  );
}