import Navbar from "@/components/Navbar";
import BannerSlider from "@/components/BannerSlider";
import SearchBar from "@/components/SearchBar";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import NewArrivals from "@/components/NewArrivals";
import LocationCard from "@/components/LocationCard";
import Link from "next/link";

export default function Home() {
  const services = [
    {
      icon: "🚚",
      title: "Free Delivery",
      text: "Fast Shipping",
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      text: "Safe Checkout",
    },
    {
      icon: "⭐",
      title: "Premium",
      text: "Quality Products",
    },
    {
      icon: "📞",
      title: "Support",
      text: "24/7 Help",
    },
  ];

  return (
    <>
      <Navbar />

      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-gradient-to-b
          from-[#fffaf5]
          via-[#fff4e8]
          to-white
          pb-28
          text-gray-900
          dark:from-gray-950
          dark:via-gray-900
          dark:to-black
          dark:text-white
        "
      >
        {/* =========================
            ANIMATED BACKGROUND
        ========================= */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="
              home-glow
              absolute
              -left-40
              top-32
              h-80
              w-80
              rounded-full
              bg-orange-300/25
              blur-3xl
            "
          />

          <div
            className="
              home-glow
              home-delay-2
              absolute
              -right-40
              top-[650px]
              h-96
              w-96
              rounded-full
              bg-rose-200/25
              blur-3xl
            "
          />

          <div
            className="
              home-glow
              home-delay-4
              absolute
              left-1/2
              top-[1200px]
              h-80
              w-80
              -translate-x-1/2
              rounded-full
              bg-yellow-200/20
              blur-3xl
            "
          />

          <div
            className="
              home-float
              absolute
              left-[8%]
              top-[420px]
              h-3
              w-3
              rounded-full
              bg-orange-300/70
            "
          />

          <div
            className="
              home-float-slow
              absolute
              right-[10%]
              top-[900px]
              h-4
              w-4
              rounded-full
              bg-rose-300/60
            "
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          {/* ================= SEARCH ================= */}

          <section
            className="
              home-reveal
              px-3
              pt-4
              sm:px-5
              sm:pt-6
              lg:px-8
            "
          >
            <div
              className="
                rounded-[24px]
                border
                border-white/70
                bg-white/95
                p-2
                shadow-[0_10px_35px_rgba(15,23,42,0.07)]
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_16px_45px_rgba(249,115,22,0.10)]
                dark:border-gray-800
                dark:bg-gray-900/90
                sm:rounded-[28px]
                sm:p-2.5
              "
            >
              <SearchBar />
            </div>
          </section>

          {/* ================= BANNER ================= */}

          <section
            className="
              home-reveal
              home-delay-1
              mt-4
              px-3
              sm:mt-6
              sm:px-5
              lg:px-8
            "
          >
            <div
              className="
                group
                overflow-hidden
                rounded-[26px]
                border
                border-white/60
                bg-white
                shadow-[0_18px_50px_rgba(15,23,42,0.10)]
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-[0_25px_65px_rgba(249,115,22,0.14)]
                dark:border-gray-800
                dark:bg-gray-900
                sm:rounded-[34px]
              "
            >
              <div
                className="
                  transition-transform
                  duration-700
                  group-hover:scale-[1.01]
                "
              >
                <BannerSlider />
              </div>
            </div>
          </section>

          {/* ================= SERVICES ================= */}

          <section
            className="
              home-reveal
              home-delay-2
              mt-7
              px-3
              sm:mt-10
              sm:px-5
              lg:px-8
            "
          >
            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:gap-4
                md:grid-cols-4
              "
            >
              {services.map((item, index) => (
                <div
                  key={item.title}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[22px]
                    border
                    border-orange-100
                    bg-white/95
                    p-4
                    text-center
                    shadow-[0_8px_30px_rgba(15,23,42,0.05)]
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:scale-[1.02]
                    hover:border-orange-200
                    hover:shadow-[0_18px_45px_rgba(249,115,22,0.14)]
                    dark:border-gray-800
                    dark:bg-gray-900/90
                    sm:rounded-[28px]
                    sm:p-6
                  "
                >
                  {/* Glow */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-8
                      -top-8
                      h-24
                      w-24
                      rounded-full
                      bg-orange-100
                      opacity-0
                      blur-2xl
                      transition-all
                      duration-500
                      group-hover:scale-150
                      group-hover:opacity-100
                      dark:bg-orange-500/10
                    "
                  />

                  {/* Icon */}

                  <div
                    className={`
                      relative
                      mx-auto
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-br
                      from-orange-50
                      to-orange-100
                      text-2xl
                      shadow-sm
                      transition-all
                      duration-300
                      group-hover:rotate-3
                      group-hover:scale-110
                      dark:from-gray-800
                      dark:to-gray-700
                      sm:h-14
                      sm:w-14
                      sm:text-3xl
                      ${
                        index % 2 === 0
                          ? "home-float"
                          : "home-float-slow"
                      }
                    `}
                  >
                    {item.icon}
                  </div>

                  <h3
                    className="
                      relative
                      mt-3
                      text-xs
                      font-extrabold
                      tracking-tight
                      text-gray-900
                      transition-colors
                      duration-300
                      group-hover:text-orange-600
                      dark:text-white
                      sm:text-base
                    "
                  >
                    {item.title}
                  </h3>

                  <p
                    className="
                      relative
                      mt-1
                      text-[10px]
                      font-medium
                      text-gray-500
                      dark:text-gray-400
                      sm:text-xs
                    "
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ================= CATEGORIES ================= */}

          <section
            className="
              home-reveal
              home-delay-3
              mt-10
              sm:mt-14
            "
          >
            <CategorySection />
          </section>

          {/* ================= PRODUCTS ================= */}

          <section
            className="
              home-reveal
              home-delay-4
              mt-10
              sm:mt-14
            "
          >
            <ProductSection />
          </section>

          {/* ================= EXPLORE MORE ================= */}

          <section
            className="
              home-reveal
              home-delay-5
              mt-9
              px-3
              sm:mt-14
              sm:px-5
              lg:px-8
            "
          >
            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[28px]
                bg-gradient-to-br
                from-orange-600
                via-orange-500
                to-amber-400
                px-5
                py-9
                text-center
                text-white
                shadow-[0_20px_55px_rgba(249,115,22,0.28)]
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-[0_30px_75px_rgba(249,115,22,0.34)]
                sm:rounded-[36px]
                sm:px-10
                sm:py-14
              "
            >
              {/* Animated decorative circles */}

              <div
                className="
                  home-floating-circle
                  pointer-events-none
                  absolute
                  -left-14
                  -top-14
                  h-44
                  w-44
                  rounded-full
                  bg-white/10
                  blur-xl
                "
              />

              <div
                className="
                  home-floating-circle-reverse
                  pointer-events-none
                  absolute
                  -bottom-20
                  -right-14
                  h-56
                  w-56
                  rounded-full
                  bg-yellow-200/20
                  blur-2xl
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-0
                  h-40
                  w-40
                  -translate-x-1/2
                  rounded-full
                  bg-white/10
                  blur-3xl
                  transition-all
                  duration-700
                  group-hover:scale-150
                "
              />

              <div className="relative z-10 mx-auto max-w-2xl">
                <div
                  className="
                    home-soft-pulse
                    mx-auto
                    mb-4
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-white/20
                    bg-white/10
                    px-4
                    py-2
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    backdrop-blur-md
                    sm:text-xs
                  "
                >
                  ✨ Nithesh Cosmetics
                </div>

                <h2
                  className="
                    text-2xl
                    font-black
                    leading-tight
                    tracking-tight
                    sm:text-3xl
                    md:text-4xl
                    lg:text-5xl
                  "
                >
                  Premium Beauty Collection
                </h2>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-xl
                    text-sm
                    leading-6
                    text-white/90
                    sm:mt-4
                    sm:text-base
                    sm:leading-7
                  "
                >
                  Discover professional barber tools,
                  cosmetics and premium beauty
                  accessories.
                </p>

                <Link
                  href="/products"
                  className="
                    group/button
                    mt-7
                    inline-flex
                    min-h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-white
                    px-7
                    py-3
                    text-sm
                    font-extrabold
                    text-orange-600
                    shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:scale-[1.03]
                    hover:shadow-[0_18px_40px_rgba(0,0,0,0.20)]
                    active:scale-95
                    sm:min-h-14
                    sm:px-9
                    sm:text-base
                    dark:bg-gray-950
                    dark:text-orange-400
                  "
                >
                  Shop Now

                  <span
                    className="
                      transition-transform
                      duration-300
                      group-hover/button:translate-x-1.5
                    "
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </section>

          {/* ================= NEW ARRIVALS ================= */}

          <section
            className="
              home-reveal
              home-delay-6
              mt-10
              sm:mt-14
            "
          >
            <NewArrivals />
          </section>

          {/* ================= LOCATION ================= */}

          <section
            className="
              home-reveal
              home-delay-7
              mt-9
              px-3
              sm:mt-14
              sm:px-5
              lg:px-8
            "
          >
            <div
              className="
                overflow-hidden
                rounded-[28px]
                border
                border-gray-100
                bg-white
                shadow-[0_12px_40px_rgba(15,23,42,0.06)]
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-[0_20px_55px_rgba(15,23,42,0.10)]
                dark:border-gray-800
                dark:bg-gray-900
                sm:rounded-[34px]
              "
            >
              <LocationCard />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}