"use client";

import { useState } from "react";
import { db, storage } from "../../lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";


export default function AddProduct() {


  const [name, setName] = useState("");

  const [mrp, setMrp] = useState("");

  const [discount, setDiscount] = useState("");

  const [category, setCategory] = useState("");

  const [description, setDescription] = useState("");

  const [deliveryFee, setDeliveryFee] = useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);



  const sellingPrice =
    Number(mrp || 0) -
    Number(discount || 0);





  const handleSubmit = async (
    e: React.FormEvent
  ) => {


    e.preventDefault();



    if (
      !name ||
      !mrp ||
      !category
    ) {

      alert(
        "Please fill all required fields."
      );

      return;

    }




    setLoading(true);



    try {


      let imageUrl = "";



      if(image){


        const imageRef =
          ref(
            storage,
            `products/${Date.now()}-${image.name}`
          );



        const snapshot =
          await uploadBytes(
            imageRef,
            image
          );



        imageUrl =
          await getDownloadURL(
            snapshot.ref
          );


      }





      await addDoc(
        collection(
          db,
          "products"
        ),
        {


          name,


          mrp:
            Number(mrp),


          discount:
            Number(discount || 0),


          price:
            sellingPrice,


          category,


          description,


          image:
            imageUrl,


          deliveryFee:
            Number(deliveryFee || 0),



          createdAt:
            Timestamp.now(),


        }
      );




      alert(
        "✅ Product Added Successfully!"
      );



      setName("");

      setMrp("");

      setDiscount("");

      setCategory("");

      setDescription("");

      setDeliveryFee("");

      setImage(null);



    }

    catch(error){


      console.error(error);


      alert(
        "Failed to add product"
      );


    }



    setLoading(false);


  };







  return (


    <main className="
      min-h-screen
      bg-gray-100
      flex
      items-center
      justify-center
      p-6
    ">


      <form

        onSubmit={handleSubmit}

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

          Add Product

        </h1>





        <input

          type="text"

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

          placeholder="Selling Price"

        />






        <input

          type="number"

          placeholder="Delivery Fee"

          className="
            w-full
            border
            p-3
            rounded
            mb-4
          "

          value={deliveryFee}

          onChange={(e)=>
            setDeliveryFee(e.target.value)
          }

        />







        <input

          type="text"

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

          placeholder="Product Description"

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

          type="file"

          accept="image/*"

          className="
            w-full
            border
            p-3
            rounded
            mb-6
          "

          onChange={(e)=>{


            if(
              e.target.files?.[0]
            ){

              setImage(
                e.target.files[0]
              );

            }


          }}

        />








        <button

          type="submit"

          disabled={loading}

          className="
            w-full
            bg-black
            text-white
            py-3
            rounded-lg
            hover:bg-yellow-500
            hover:text-black
            transition
          "

        >

          {
            loading
            ?
            "Uploading..."
            :
            "Save Product"
          }


        </button>





      </form>



    </main>


  );


}