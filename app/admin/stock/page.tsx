"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";


interface Product {

  id:string;

  name:string;

  image?:string;

  stock?:number;

}



export default function StockManagementPage(){


  const [products,setProducts] =
    useState<Product[]>([]);


  const [loading,setLoading] =
    useState(true);



  const [stockValues,setStockValues] =
    useState<{[key:string]:number}>({});




  useEffect(()=>{

    fetchProducts();

  },[]);





  async function fetchProducts(){


    try{


      const snapshot =
        await getDocs(
          collection(db,"products")
        );



      const list =
        snapshot.docs.map((item)=>{


          const data=item.data();


          return {

            id:item.id,

            name:data.name || "",

            image:data.image || "",

            stock:Number(data.stock) || 0,

          };


        });



      setProducts(list);



      const stocks:any={};


      list.forEach((item)=>{

        stocks[item.id]=item.stock;

      });



      setStockValues(stocks);



    }
    catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }


  }





  async function updateStock(id:string){


    try{


      const productRef =
        doc(
          db,
          "products",
          id
        );



      await updateDoc(
        productRef,
        {
          stock:
          Number(stockValues[id])
        }
      );



      alert(
        "Stock Updated Successfully ✅"
      );


    }
    catch(error){

      console.log(error);

      alert(
        "Update failed"
      );

    }


  }






  if(loading){


    return (

      <div className="
        h-screen
        flex
        items-center
        justify-center
        text-xl
        font-bold
      ">

        Loading Stock...

      </div>

    );


  }





return (


<main className="
 min-h-screen
 bg-gray-100
 dark:bg-gray-950
 p-5
">


<h1 className="
 text-3xl
 font-bold
 mb-6
 text-gray-900
 dark:text-white
">

📦 Stock Management

</h1>





<div className="
 grid
 gap-5
">


{

products.map((product)=>(


<div

key={product.id}

className="
 bg-white
 dark:bg-gray-900
 rounded-2xl
 shadow
 p-4
 flex
 flex-col
 md:flex-row
 gap-4
 items-center
"


>



<img

src={
product.image ||
"/placeholder.png"
}

alt={product.name}

className="
 w-24
 h-24
 object-contain
 rounded-xl
 bg-gray-100
"

/>




<div className="
 flex-1
">


<h2 className="
 font-bold
 text-lg
 dark:text-white
">

{product.name}

</h2>



<p className="
 mt-2
 text-gray-500
 dark:text-gray-400
">

Current Stock:

<span className="
 font-bold
 ml-2
">

{product.stock}

</span>

</p>



</div>






<input

type="number"

value={
stockValues[product.id]
}

onChange={(e)=>

setStockValues({

...stockValues,

[product.id]:
Number(e.target.value)

})

}

className="
 border
 rounded-lg
 p-3
 w-full
 md:w-32
 dark:bg-gray-800
 dark:text-white
"

/>





<button

onClick={()=>
updateStock(product.id)
}

className="
 bg-green-600
 hover:bg-green-700
 text-white
 px-5
 py-3
 rounded-xl
 font-bold
"


>

Save

</button>





</div>


))


}


</div>



</main>


);


}