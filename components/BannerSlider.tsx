"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
} from "swiper/modules";

import { supabase } from "@/app/lib/supabase";

import "swiper/css";

type Banner = {
  id: string;
  image: string;
};

export default function BannerSlider() {
  const [banners, setBanners] =
    useState<Banner[]>([]);

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    const {
      data,
      error,
    } = await supabase
      .from("banners")
      .select("id,image")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Banner loading error:",
        error
      );

      return;
    }

    setBanners(
      (data || []) as Banner[]
    );
  }

  if (banners.length === 0) {
    return null;
  }

  return (
    <section
      className="
        w-full
        overflow-hidden
      "
    >
      <Swiper
        modules={[
          Autoplay,
        ]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={
          banners.length > 1
        }
        spaceBetween={12}
        slidesPerView={1}
        className="w-full"
      >
        {banners.map(
          (banner) => (
            <SwiperSlide
              key={banner.id}
            >
              <div
                className="
                  relative
                  w-full
                  overflow-hidden
                  rounded-2xl
                  bg-black
                  shadow-[0_15px_40px_rgba(15,23,42,0.14)]
                  sm:rounded-[28px]
                  lg:rounded-[32px]
                "
              >
                {/* FULL IMAGE */}

                <img
                  src={
                    banner.image
                  }
                  alt="Nithesh Cosmetics Banner"
                  className="
                    block
                    h-auto
                    w-full
                    object-contain
                  "
                />

                {/* SHOP NOW ONLY */}

                <Link
                  href="/products"
                  className="
                    absolute
                    bottom-3
                    left-3
                    z-20

                    inline-flex
                    items-center
                    justify-center

                    rounded-full
                    bg-gradient-to-r
                    from-orange-500
                    to-orange-600

                    px-4
                    py-2

                    text-[11px]
                    font-black
                    text-white

                    shadow-[0_8px_25px_rgba(249,115,22,0.45)]

                    transition-all
                    active:scale-95

                    sm:bottom-5
                    sm:left-5
                    sm:px-6
                    sm:py-3
                    sm:text-sm

                    lg:bottom-7
                    lg:left-7
                    lg:px-7
                    lg:py-3.5
                    lg:text-base
                  "
                >
                  Shop Now →
                </Link>
              </div>
            </SwiperSlide>
          )
        )}
      </Swiper>
    </section>
  );
}