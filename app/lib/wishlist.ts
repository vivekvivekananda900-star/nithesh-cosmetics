import { supabase } from "@/app/lib/supabase";


// Get Wishlist Products
export async function getWishlist() {

  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    return [];
  }


  const { data, error } = await supabase
    .from("wishlist")
    .select(`
      id,
      product_id,
      product:products(
        id,
        name,
        price,
        category,
        image,
        images
      )
    `)
    .eq("user_id", user.id);



  if (error) {

    console.log("Wishlist Error:", error);

    return [];

  }



  return (data || []).map((item:any)=>({

    id:item.id,

    product_id:item.product_id,

    product:Array.isArray(item.product)
      ? item.product[0]
      : item.product

  }));

}




// Check Product Already In Wishlist
export async function isInWishlist(
  productId:string
) {


  const {
    data:{
      user
    }
  } = await supabase.auth.getUser();



  if(!user){
    return false;
  }



  const {data,error}=await supabase
    .from("wishlist")
    .select("id")
    .eq("user_id",user.id)
    .eq("product_id",productId)
    .maybeSingle();



  if(error){

    console.log(error);

    return false;

  }



  return !!data;

}





// Add / Remove Wishlist
export async function toggleWishlist(
  productId:string
) {


  const {
    data:{
      user
    }
  } = await supabase.auth.getUser();



  if(!user){

    return {
      success:false,
      message:"Please login"
    };

  }




  const exists = await isInWishlist(productId);




  if(exists){


    await supabase
      .from("wishlist")
      .delete()
      .eq("user_id",user.id)
      .eq("product_id",productId);



    return {
      success:true,
      action:"removed"
    };


  }





  const {error}=await supabase
    .from("wishlist")
    .insert({

      user_id:user.id,

      product_id:productId

    });





  if(error){

    console.log(error);

    return {
      success:false
    };

  }



  return {
    success:true,
    action:"added"
  };


}





// Remove Wishlist Item
export async function removeWishlistItem(
  id:string
) {


  const {error}=await supabase
    .from("wishlist")
    .delete()
    .eq("id",id);



  if(error){

    console.log(
      "Remove Error:",
      error
    );

  }

}