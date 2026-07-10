import Navbar from "@/components/Navbar";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100">

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-black to-gray-900 text-white py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">

            <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400">
              Nithesh Cosmetics
            </h1>

            <p className="mt-6 text-xl text-gray-300">
              Your Trusted Partner for Barber & Cosmetics Products
            </p>

            <a href="#products">
              <button className="mt-8 bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition duration-300">
                Shop Now
              </button>
            </a>

          </div>
        </section>

        {/* Featured Products */}
        <div id="products">
          <FeaturedProducts />
        </div>

        {/* Categories */}
        <section className="py-16 px-6 bg-gray-100">

          <h2 className="text-4xl font-bold text-center mb-10">
            Our Categories
          </h2>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-bold">✂️ Shaving Machines</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-bold">💈 Barber Items</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-bold">🧴 Facial Products</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-bold">💄 Cosmetics</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-bold">🪮 Grooming Accessories</h3>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition">
              <h3 className="text-xl font-bold">➕ More Products Coming Soon</h3>
            </div>

          </div>

        </section>

        {/* About */}
        <section className="bg-white py-20 px-6">

          <div className="max-w-5xl mx-auto text-center">

            <h2 className="text-4xl font-bold mb-6">
              About Nithesh Cosmetics
            </h2>

            <p className="text-lg text-gray-600 leading-8">
              Nithesh Cosmetics is your trusted destination for barber tools,
              shaving machines, facial products, cosmetics, grooming
              accessories, and many other premium-quality products at affordable
              prices. We are committed to providing genuine products and
              excellent customer service.
            </p>

          </div>

        </section>

        {/* Contact */}
        <section className="bg-black text-white py-20">

          <div className="max-w-5xl mx-auto text-center">

            <h2 className="text-4xl font-bold text-yellow-400">
              Contact Us
            </h2>

            <p className="mt-8 text-lg">
              📍 Near VKR Hospital
              <br />
              Naganool Road
              <br />
              Nagarkurnool - 509209
            </p>

            <div className="mt-10 flex justify-center gap-5 flex-wrap">

              <a
                href="https://wa.me/919676578296"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-green-500 px-8 py-3 rounded-lg font-bold hover:bg-green-600">
                  WhatsApp
                </button>
              </a>

              <a href="tel:+919676578296">
                <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400">
                  Call Now
                </button>
              </a>

            </div>

          </div>

        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-6 text-center">
          <p>© 2026 Nithesh Cosmetics. All Rights Reserved.</p>
        </footer>

      </main>
    </>
  );
}