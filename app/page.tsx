import Navbar from "@/components/Navbar";
import BannerSlider from "@/components/BannerSlider";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import BottomNavigation from "@/components/BottomNavigation";
import NewArrivals from "@/components/NewArrivals";
import LocationCard from "@/components/LocationCard";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

<SearchBar />

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 pb-24">

        {/* Welcome Card */}
        <section className="px-4 pt-4">
          <div className="rounded-3xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 shadow-xl">
            <h1 className="text-3xl font-bold">
              Welcome 👋
            </h1>

            <p className="mt-2 text-white/90">
              Discover premium barber tools, cosmetics,
              grooming essentials and exclusive offers.
            </p>
          </div>
        </section>

        {/* Banner */}
        <BannerSlider />

        {/* Categories */}
        <CategorySection />

        {/* Offer Banner */}
        <section className="px-4 mt-8">
          <div className="rounded-3xl bg-green-600 text-white p-6 flex items-center justify-between">
            <div>
              <p className="text-sm">
                Limited Time
              </p>

              <h2 className="text-2xl font-bold">
                30% OFF
              </h2>

              <p className="text-sm mt-1">
                On selected products
              </p>
            </div>

            <div className="text-6xl">
              🎁
            </div>
          </div>
        </section>

        {/* Products */}
        <ProductSection />

        {/* Why Choose Us */}
        <section className="px-4 mt-10">
          <h2 className="text-2xl font-bold mb-4">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white rounded-2xl p-5 shadow">
              <div className="text-4xl">🚚</div>

              <h3 className="font-semibold mt-2">
                Fast Delivery
              </h3>

              <p className="text-sm text-gray-500">
                Quick and reliable shipping.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow">
              <div className="text-4xl">💯</div>

              <h3 className="font-semibold mt-2">
                Original Products
              </h3>

              <p className="text-sm text-gray-500">
                100% genuine quality.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow">
              <div className="text-4xl">💳</div>

              <h3 className="font-semibold mt-2">
                Secure Payment
              </h3>

              <p className="text-sm text-gray-500">
                Safe and trusted checkout.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow">
              <div className="text-4xl">📞</div>

              <h3 className="font-semibold mt-2">
                Customer Support
              </h3>

              <p className="text-sm text-gray-500">
                Friendly support anytime.
              </p>
            </div>

          </div>
        </section>
        {/* Explore */}
        <section className="px-4 mt-10">
          <div className="bg-white rounded-3xl shadow p-6 text-center">
            <h2 className="text-2xl font-bold">
              Explore More Products
            </h2>

            <p className="text-gray-500 mt-2">
              Browse our complete collection.
            </p>

            <Link
              href="/products"
              className="inline-block mt-5 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              View All Products
            </Link>
          </div>
        </section>

        {/* New Arrivals */}
        <NewArrivals />

        {/* Store Location */}
        <LocationCard />

      </main>

      <BottomNavigation />
    </>
  );
}