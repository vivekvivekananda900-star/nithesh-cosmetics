"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const banners = [
  {
    title: "Premium Barber Collection",
    subtitle: "Professional Clippers & Trimmers",
    color: "from-yellow-500 to-orange-500",
  },
  {
    title: "Beauty Essentials",
    subtitle: "Facial & Cosmetics Products",
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Special Offer",
    subtitle: "Up to 30% OFF Today",
    color: "from-green-500 to-emerald-600",
  },
];

export default function BannerSlider() {
  return (
    <div className="px-4 mt-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        loop
        spaceBetween={15}
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div
              className={`rounded-3xl bg-gradient-to-r ${banner.color} text-white p-8 h-48 flex flex-col justify-center shadow-xl`}
            >
              <p className="text-sm font-medium opacity-90">
                Nithesh Cosmetics
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {banner.title}
              </h2>

              <p className="mt-2 text-white/90">
                {banner.subtitle}
              </p>

              <button className="mt-5 w-fit bg-white text-black px-5 py-2 rounded-xl font-semibold hover:scale-105 transition">
                Shop Now
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}