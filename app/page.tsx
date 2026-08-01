import Navbar from "@/components/Navbar";
import BannerSlider from "@/components/BannerSlider";
import SearchBar from "@/components/SearchBar";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import NewArrivals from "@/components/NewArrivals";
import LocationCard from "@/components/LocationCard";
import Link from "next/link";


export default function Home() {

  return (

    <>

      <Navbar />


      <main className="
  min-h-screen
  bg-gradient-to-b
  from-orange-50
  via-orange-100
  to-white
  dark:from-gray-950
  dark:via-gray-900
  dark:to-black
  text-gray-900
  dark:text-white
  pb-24
">



        {/* Search */}

        <section className="
          px-3
          sm:px-4
          pt-4
          sm:pt-5
        ">

          <div className="
            bg-white
            dark:bg-gray-800
            rounded-3xl
            shadow-lg
            p-2
          ">

            <SearchBar />

          </div>

        </section>








        {/* Banner */}

        <section className="
          mt-4 sm:mt-5 px-3 sm:px-4
        ">

          <div className="
            rounded-3xl
            overflow-hidden
            shadow-xl
          ">

            <BannerSlider />

          </div>


        </section>









        {/* Premium Services */}

<section className="px-3 sm:px-4 mt-8">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
    {[
      {
        icon: "🚚",
        title: "Free Delivery",
        text: "Fast Shipping",
      },
      {
        icon: "🔒",
        title: "Secure Payment",
        text: "Safe Checkout",
      },
      {
        icon: "⭐",
        title: "Premium",
        text: "Quality Products",
      },
      {
        icon: "📞",
        title: "Support",
        text: "24/7 Help",
      },
    ].map((item, index) => (
      <div
        key={index}
        className="
          bg-white
          dark:bg-gray-800
          rounded-2xl sm:rounded-3xl
          shadow-md
          p-3 sm:p-5
          text-center
          hover:shadow-xl
          transition
          border
          border-orange-200
          dark:border-gray-700
        "
      >
        <div className="text-3xl sm:text-4xl">
          {item.icon}
        </div>

        <h3 className="font-semibold text-sm sm:text-base mt-2 sm:mt-3">
          {item.title}
        </h3>

        <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
          {item.text}
        </p>
      </div>
    ))}
  </div>
</section>









        {/* Categories */}


        <section className="
          mt-10
        ">

          <CategorySection />

        </section>









        {/* Products */}


        <section className="
          mt-10
        ">

          <ProductSection />

        </section>









        {/* Explore More */}


        <section className="
          px-3 sm:px-4 mt-8 sm:mt-10
        ">


          <div className="
            bg-gradient-to-r
            from-orange-600
            via-orange-500
            to-yellow-500
            rounded-[30px]
            p-5 sm:p-8
            text-center
            text-white
            shadow-xl
          ">



            <h2 className="
              text-2xl sm:text-3xl md:text-4xl
              font-extrabold
            ">

              Premium Beauty Collection

            </h2>



            <p className="
              mt-2 sm:mt-3 text-sm sm:text-base
              text-white/90
            ">

              Discover professional barber tools,
              cosmetics and accessories.

            </p>




            <Link

              href="/products"

              className="
                inline-block
                mt-6
                bg-white
                dark:bg-gray-900
                text-orange-600
                dark:text-orange-400
                font-bold
                px-6 sm:px-8 py-2.5 sm:py-3
                rounded-2xl
                hover:scale-105
                transition
              "

            >

              Shop Now →

            </Link>



          </div>



        </section>









        {/* New Arrivals */}


        <section className="
          mt-10
        ">


          <NewArrivals />


        </section>









        {/* Location */}


        <section className="
          mt-8 sm:mt-10 px-3 sm:px-4
        ">


          <LocationCard />


        </section>







      </main>





     


    </>

  );

}