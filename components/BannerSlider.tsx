"use client";

import { useEffect, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";

import "swiper/css";
import "swiper/css/pagination";


interface Banner {

  id:string;

  title:string;

  subtitle:string;

  image:string;

}



export default function BannerSlider(){

  const [banners,setBanners] =
    useState<Banner[]>([]);



  useEffect(()=>{

    loadBanners();

  },[]);




  async function loadBanners(){

    try{

      const q = query(
        collection(db,"banners"),
        orderBy("createdAt","desc")
      );


      const snapshot =
        await getDocs(q);



      const data =
        snapshot.docs.map((doc)=>({

          id:doc.id,

          ...doc.data()

        })) as Banner[];



      setBanners(data);



    }catch(error){

      console.log(
        "Banner loading error",
        error
      );

    }

  }




  if(banners.length===0){

    return null;

  }



  return (

    <div className="px-4 mt-4">


      <Swiper

        modules={[
          Autoplay,
          Pagination
        ]}

        autoplay={{
          delay:3000,
          disableOnInteraction:false,
        }}

        pagination={{
          clickable:true
        }}

        loop

        spaceBetween={15}

      >


      {
        banners.map((banner)=>(


          <SwiperSlide
            key={banner.id}
          >


            <div className="
              rounded-3xl
              overflow-hidden
              shadow-xl
              bg-white
            ">


              <img

                src={banner.image}

                alt={banner.title}

                className="
                  w-full
                  h-52
                  object-cover
                "

              />



              <div className="
                p-6
                bg-gradient-to-r
                from-yellow-500
                to-orange-500
                text-white
              ">


                <p className="text-sm">
                  Nithesh Cosmetics
                </p>


                <h2 className="
                  text-3xl
                  font-bold
                  mt-2
                ">
                  {banner.title}
                </h2>


                <p className="mt-2">
                  {banner.subtitle}
                </p>


                <button
                  className="
                    mt-5
                    bg-white
                    text-black
                    px-5
                    py-2
                    rounded-xl
                    font-semibold
                  "
                >
                  Shop Now
                </button>


              </div>


            </div>


          </SwiperSlide>


        ))
      }


      </Swiper>


    </div>

  );

}