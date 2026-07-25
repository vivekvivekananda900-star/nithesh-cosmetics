"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/app/lib/supabase";


export default function EditProduct() {


  const { id } = useParams();

  const router = useRouter();



  const [name,setName] = useState("");

  const [mrp,setMrp] = useState("");

  const [discount,setDiscount] = useState("");

  const [category,setCategory] = useState("");

  const [description,setDescription] = useState("");

  const [image,setImage] = useState("");

  const [loading,setLoading] = useState(true);





  const sellingPrice =
    Number(mrp || 0) -
    Number(discount || 0);







  useEffect(()=>{


    checkAdmin();


  },[id]);







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



    fetchProduct();


  }







  async function fetchProduct(){


    if(!id)
      return;



    const {
      data,
      error
    } = await supabase
    .from("products")
    .select("*")
    .eq(
      "id",
      id
    )
    .single();




    if(error){

      console.log(error);

      alert(
        "Product not found"
      );

      return;

    }





    setName(data.name || "");

    setMrp(
      String(data.mrp || "")
    );

    setDiscount(
      String(data.discount || "")
    );

    setCategory(
      data.category || ""
    );

    setDescription(
      data.description || ""
    );

    setImage(
      data.image || ""
    );



    setLoading(false);


  }









  async function updateProduct(){


    try{


      const {
        error
      } = await supabase
      .from("products")
      .update({

        name,

        mrp:Number(mrp),

        discount:Number(discount),

        price:sellingPrice,

        category,

        description,

        image

      })
      .eq(
        "id",
        id
      );





      if(error){

        throw error;

      }




      alert(
        "✅ Product Updated Successfully!"
      );


      router.push(
        "/admin/products"
      );



    }
    catch(error:any){


      console.log(error);


      alert(
        "❌ Failed to update product"
      );


    }


  }









  if(loading){


    return(

      <main className="
      min-h-screen
      flex
      items-center
      justify-center
      ">

        <h1 className="
        text-2xl
        font-bold
        ">

          Loading...

        </h1>


      </main>

    );


  }








  return(


    <main className="
    min-h-screen
    bg-gray-100
    flex
    justify-center
    items-center
    p-6
    ">



      <form
      className="
      bg-white
      p-8
      rounded-xl
      shadow-xl
      w-full
      max-w-lg
      "
      >



        <h1 className="
        text-3xl
        font-bold
        text-center
        mb-6
        ">

          Edit Product

        </h1>





        <input

        placeholder="Product Name"

        className="
        w-full
        border
        p-3
        rounded
        mb-4
        "

        value={name}

        onChange={(e)=>
          setName(e.target.value)
        }

        />





        <input

        type="number"

        placeholder="MRP"

        className="
        w-full
        border
        p-3
        rounded
        mb-4
        "

        value={mrp}

        onChange={(e)=>
          setMrp(e.target.value)
        }

        />





        <input

        type="number"

        placeholder="Discount"

        className="
        w-full
        border
        p-3
        rounded
        mb-4
        "

        value={discount}

        onChange={(e)=>
          setDiscount(e.target.value)
        }

        />





        <input

        type="number"

        value={sellingPrice}

        readOnly

        className="
        w-full
        border
        p-3
        rounded
        mb-4
        bg-gray-100
        "

        />





        <input

        placeholder="Category"

        className="
        w-full
        border
        p-3
        rounded
        mb-4
        "

        value={category}

        onChange={(e)=>
          setCategory(e.target.value)
        }

        />





        <textarea

        placeholder="Description"

        className="
        w-full
        border
        p-3
        rounded
        mb-4
        "

        value={description}

        onChange={(e)=>
          setDescription(e.target.value)
        }

        />





        <input

        placeholder="Image URL"

        className="
        w-full
        border
        p-3
        rounded
        mb-6
        "

        value={image}

        onChange={(e)=>
          setImage(e.target.value)
        }

        />







        <button

        type="button"

        onClick={updateProduct}

        className="
        w-full
        bg-blue-600
        text-white
        py-3
        rounded-lg
        hover:bg-blue-700
        "

        >

          💾 Save Changes

        </button>




      </form>



    </main>


  );


}