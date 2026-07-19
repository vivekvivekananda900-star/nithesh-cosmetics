"use client";

import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";



export default function BannerAdminPage() {


  const [banners,setBanners] = useState<any[]>([]);


  const [title,setTitle] = useState("");

  const [subtitle,setSubtitle] = useState("");

  const [image,setImage] = useState("");

  const [editId,setEditId] = useState("");




  useEffect(()=>{

    loadBanners();

  },[]);






  async function loadBanners(){


    const snapshot = await getDocs(
      collection(db,"banners")
    );


    setBanners(

      snapshot.docs.map((item)=>({

        id:item.id,

        ...item.data()

      }))

    );


  }







  async function addBanner(){


    if(!title || !subtitle || !image){

      alert("Fill all fields");

      return;

    }



    await addDoc(

      collection(db,"banners"),

      {

        title,

        subtitle,

        image,

        createdAt:new Date()

      }

    );



    setTitle("");

    setSubtitle("");

    setImage("");



    loadBanners();


  }








  async function deleteBanner(id:string){


    await deleteDoc(

      doc(
        db,
        "banners",
        id
      )

    );


    loadBanners();


  }








  async function editBanner(id:string){


    const newTitle =
      prompt(
        "Enter new banner title"
      );



    const newSubtitle =
      prompt(
        "Enter new banner subtitle"
      );



    const newImage =
      prompt(
        "Enter new image URL"
      );



    if(
      !newTitle ||
      !newSubtitle ||
      !newImage
    ){

      return;

    }



    await updateDoc(

      doc(
        db,
        "banners",
        id
      ),

      {

        title:newTitle,

        subtitle:newSubtitle,

        image:newImage

      }

    );



    loadBanners();


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






      {/* Add Banner */}

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

          onChange={(e)=>
            setTitle(e.target.value)
          }

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

          onChange={(e)=>
            setSubtitle(e.target.value)
          }

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

          onChange={(e)=>
            setImage(e.target.value)
          }

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
            hover:bg-green-700
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









      {/* Banner List */}


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





              <p className="
                text-gray-500
                mt-2
              ">

                {banner.subtitle}

              </p>







              <div className="flex gap-3 mt-4">



              <button

                onClick={()=>
                  editBanner(banner.id)
                }

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

                onClick={()=>
                  deleteBanner(banner.id)
                }

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