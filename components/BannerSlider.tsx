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

    <div className="w-full overflow-hidden">


      <Swiper

        modules={[Autoplay, Pagination]}

        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}

        pagination={{
          clickable: true,
        }}

        loop

        spaceBetween={15}

        className="w-full"

      >


        {banners.map((banner) => (

          <SwiperSlide

            key={banner.id}

            className="w-full"

          >


            <div className="
              relative
              w-full
              overflow-hidden
              rounded-2xl
              sm:rounded-3xl
              shadow-xl
            ">


              <img

                src={banner.image}

                alt={banner.title}

                className="
                  w-full
                  h-48
                  sm:h-64
                  md:h-80
                  lg:h-[420px]
                  object-cover
                "

              />



              <div className="
                absolute
                inset-0
                bg-gradient-to-r
                from-black/70
                via-black/40
                to-transparent
              " />




              <div className="
                absolute
                inset-0
                flex
                flex-col
                justify-end
                p-4
                sm:p-6
                md:p-8
                text-white
              ">



                <p className="
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-orange-300
                  tracking-wider
                  uppercase
                ">

                  Nithesh Cosmetics

                </p>




                <h2 className="
                  mt-2
                  text-xl
                  sm:text-3xl
                  md:text-4xl
                  lg:text-5xl
                  font-extrabold
                  leading-tight
                ">

                  {banner.title}

                </h2>





                <p className="
                  mt-2
                  text-sm
                  sm:text-base
                  text-white/90
                  max-w-md
                ">

                  {banner.subtitle}

                </p>





                <button

                  className="
                    mt-4
                    sm:mt-5
                    w-fit
                    bg-orange-500
                    hover:bg-orange-600
                    transition
                    px-5
                    sm:px-6
                    py-2.5
                    sm:py-3
                    rounded-xl
                    font-semibold
                    shadow-lg
                  "

                >

                  Shop Now →

                </button>



              </div>


            </div>



          </SwiperSlide>


        ))}



      </Swiper>


    </div>

  );

}