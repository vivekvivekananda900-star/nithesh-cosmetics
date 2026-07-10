import Link from "next/link";
import Navbar from "@/components/Navbar";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100">

        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-black via-gray-900 to-black text-white py-20 md:py-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <span className="inline-block bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Premium Barber & Cosmetics Store
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-yellow-400">
              Nithesh Cosmetics
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
              Premium shaving machines, barber tools, facial products,
              cosmetics, grooming accessories and much more at affordable prices.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

              <Link href="/products">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 rounded-xl font-bold transition shadow-lg w-full sm:w-auto">
                  🛍 Shop Now
                </button>
              </Link>

              <a
                href="https://wa.me/919676578296"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg w-full sm:w-auto">
                  WhatsApp Us
                </button>
              </a>

            </div>

          </div>
        </section>

        {/* Featured Products */}
        <div id="products">
          <FeaturedProducts />
        </div>

        {/* Categories */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Shop by Category
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition">
                <div className="text-5xl mb-4">✂️</div>
                <h3 className="font-bold">Shaving Machines</h3>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition">
                <div className="text-5xl mb-4">💈</div>
                <h3 className="font-bold">Barber Items</h3>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition">
                <div className="text-5xl mb-4">🧴</div>
                <h3 className="font-bold">Facial Products</h3>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition">
                <div className="text-5xl mb-4">💄</div>
                <h3 className="font-bold">Cosmetics</h3>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition">
                <div className="text-5xl mb-4">🪮</div>
                <h3 className="font-bold">Accessories</h3>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:-translate-y-2 transition">
                <div className="text-5xl mb-4">➕</div>
                <h3 className="font-bold">More</h3>
              </div>

            </div>

          </div>
        </section>
        {/* About */}
        <section className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">

            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About Nithesh Cosmetics
            </h2>

            <p className="text-gray-600 text-lg leading-8 max-w-4xl mx-auto">
              Nithesh Cosmetics is your trusted destination for premium barber
              tools, shaving machines, facial products, cosmetics, grooming
              accessories, and many more quality products at affordable prices.
              We are committed to providing genuine products with excellent
              customer service.
            </p>

          </div>
        </section>

        {/* Contact */}
        <section className="bg-black text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">

            <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-6">
              Contact Us
            </h2>

            <p className="text-lg text-gray-300 leading-8">
              📍 Near VKR Hospital
              <br />
              Naganool Road
              <br />
              Nagarkurnool - 509209
              <br />
              📞 +91 9676578296
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

              <a
                href="https://wa.me/919676578296"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold transition w-full sm:w-auto">
                  WhatsApp
                </button>
              </a>

              <a href="tel:+919676578296">
                <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold transition w-full sm:w-auto">
                  Call Now
                </button>
              </a>

            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-10">
          <div className="max-w-7xl mx-auto px-4 text-center">

            <h3 className="text-2xl font-bold text-yellow-400">
              Nithesh Cosmetics
            </h3>

            <p className="mt-2">
              Premium Barber & Cosmetics Products
            </p>

            <p className="mt-4">
              Thank you for shopping with us ❤️
            </p>

            <p className="mt-6 text-sm">
              © 2026 Nithesh Cosmetics. vivek All Rights Reserved.
            </p>

          </div>
        </footer>

      </main>
    </>
  );
}