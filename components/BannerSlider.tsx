"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { supabase } from "@/app/lib/supabase";

import "swiper/css";
import "swiper/css/pagination";

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export default function BannerSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    loadBanners();
  }, []);

  async function loadBanners() {
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Banner loading error:", error);
      return;
    }

    setBanners(data as Banner[]);
  }

  if (banners.length === 0) return null;

  return (
    <div className="px-4 mt-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop
        spaceBetween={15}
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative overflow-hidden rounded-3xl shadow-xl">

              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-56 object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />

              <div className="absolute left-0 right-0 bottom-0 p-6 text-white">
                <p className="text-sm font-medium text-orange-300">
                  Nithesh Cosmetics
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {banner.title}
                </h2>

                <p className="mt-2 text-white/90">
                  {banner.subtitle}
                </p>

                <button className="mt-5 bg-orange-500 hover:bg-orange-600 transition px-6 py-3 rounded-xl font-semibold">
                  Shop Now
                </button>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}