"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";


export default function BannerAdminPage() {


  const router = useRouter();


  const [banners,setBanners] = useState<any[]>([]);


  const [title,setTitle] = useState("");
  const [subtitle,setSubtitle] = useState("");
  const [image,setImage] = useState("");

  const [loading,setLoading] = useState(true);



  useEffect(()=>{

    checkAdmin();

  },[]);





  async function checkAdmin(){


    const {
      data:{
        user
      }
    } = await supabase.auth.getUser();



    if(!user){

      router.push("/login");

      return;

    }




    const {data:profile}=await supabase
    .from("profiles")
    .select("role")
    .eq("id",user.id)
    .single();




    if(profile?.role !== "admin"){

      router.push("/");

      return;

    }



    loadBanners();


  }








  async function loadBanners(){


    const {
      data,
      error
    } = await supabase
    .from("banners")
    .select("*")
    .order(
      "created_at",
      {
        ascending:false
      }
    );



    if(error){

      console.log(error);

      return;

    }


    setBanners(data || []);


    setLoading(false);

  }








  async function addBanner(){


    if(!title || !subtitle || !image){

      alert("Fill all fields");

      return;

    }



    const {
      error
    } = await supabase
    .from("banners")
    .insert({

      title,

      subtitle,

      image

    });




    if(error){

      alert(error.message);

      return;

    }



    setTitle("");

    setSubtitle("");

    setImage("");



    loadBanners();


  }










  async function deleteBanner(
    id:string
  ){


    await supabase
    .from("banners")
    .delete()
    .eq(
      "id",
      id
    );


    loadBanners();


  }








  async function editBanner(
    banner:any
  ){


    const newTitle =
    prompt(
      "Enter new title",
      banner.title
    );


    const newSubtitle =
    prompt(
      "Enter new subtitle",
      banner.subtitle
    );


    const newImage =
    prompt(
      "Enter new image URL",
      banner.image
    );



    if(
      !newTitle ||
      !newSubtitle ||
      !newImage
    ){

      return;

    }





    await supabase
    .from("banners")
    .update({

      title:newTitle,

      subtitle:newSubtitle,

      image:newImage

    })
    .eq(
      "id",
      banner.id
    );



    loadBanners();


  }






  if(loading){

    return(

      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      font-bold
      ">

        Loading...

      </div>

    );

  }







  return (

    <main className="
    min-h-screen
    bg-gray-100
    dark:bg-gray-950
    p-6
    ">


      <h1 className="
      text-3xl
      font-bold
      mb-8
      dark:text-white
      ">

        🎞️ Banner Management

      </h1>





      <div className="
      bg-white
      dark:bg-gray-900
      p-6
      rounded-xl
      shadow
      max-w-xl
      ">


        <input
        placeholder="Banner Title"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        className="
        w-full
        border
        p-3
        rounded
        mb-3
        "
        />



        <input
        placeholder="Banner Subtitle"
        value={subtitle}
        onChange={(e)=>setSubtitle(e.target.value)}
        className="
        w-full
        border
        p-3
        rounded
        mb-3
        "
        />



        <input
        placeholder="Image URL"
        value={image}
        onChange={(e)=>setImage(e.target.value)}
        className="
        w-full
        border
        p-3
        rounded
        mb-3
        "
        />



        <button
        onClick={addBanner}
        className="
        bg-green-600
        text-white
        px-6
        py-3
        rounded-xl
        font-bold
        "
        >

          ➕ Add Banner

        </button>


      </div>







      <div className="
      mt-10
      grid
      md:grid-cols-3
      gap-5
      ">


      {
        banners.map((banner)=>(


          <div
          key={banner.id}
          className="
          bg-white
          dark:bg-gray-900
          rounded-xl
          shadow
          overflow-hidden
          "
          >


            <img
            src={banner.image}
            alt={banner.title}
            className="
            w-full
            h-40
            object-cover
            "
            />



            <div className="p-4">


              <h2 className="
              font-bold
              text-xl
              dark:text-white
              ">

                {banner.title}

              </h2>



              <p className="text-gray-500 mt-2">

                {banner.subtitle}

              </p>



              <div className="flex gap-3 mt-4">


                <button
                onClick={()=>editBanner(banner)}
                className="
                bg-blue-600
                text-white
                px-4
                py-2
                rounded-lg
                "
                >

                  ✏️ Edit

                </button>



                <button
                onClick={()=>deleteBanner(banner.id)}
                className="
                bg-red-600
                text-white
                px-4
                py-2
                rounded-lg
                "
                >

                  🗑 Delete

                </button>


              </div>


            </div>


          </div>


        ))
      }


      </div>


    </main>

  );

}