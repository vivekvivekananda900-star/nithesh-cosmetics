import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400">
            About Nithesh Cosmetics
          </h1>

          <p className="mt-6 text-xl text-gray-300">
            Your Trusted Partner for Barber & Cosmetics Products
          </p>
        </div>
      </section>

      {/* Shop Image */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <Image
            src="/images/shop.jpg"
            alt="Nithesh Cosmetics Shop"
            width={1200}
            height={700}
            priority
            className="w-full h-[1000px] object-cover rounded-2xl shadow-xl"
          />
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10">
          <h2 className="text-4xl font-bold text-center mb-8">
            Who We Are
          </h2>

          <p className="text-lg text-gray-700 leading-9">
            Nithesh Cosmetics is your trusted destination for premium barber
            tools, professional trimmers, shaving machines, scissors, facial
            products, grooming accessories, and cosmetics. We are committed to
            providing genuine products, affordable prices, and excellent
            customer service.
          </p>

          <p className="text-lg text-gray-700 leading-9 mt-6">
            Whether you are a barber, salon owner, or an individual customer,
            we have the right products to meet your grooming needs.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 rounded-xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-4">
                Genuine Products
              </h3>
              <p className="text-gray-600">
                We sell original and premium-quality barber and cosmetic
                products.
              </p>
            </div>

            <div className="bg-gray-100 rounded-xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold mb-4">
                Affordable Prices
              </h3>
              <p className="text-gray-600">
                High-quality products at competitive prices for everyone.
              </p>
            </div>

            <div className="bg-gray-100 rounded-xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold mb-4">
                Trusted Service
              </h3>
              <p className="text-gray-600">
                Customer satisfaction is our priority with friendly support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Our Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              ✂️ Barber Tools
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              💈 Trimmers
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              🪒 Shavers
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              💄 Cosmetics
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              🧴 Facial Products
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              🪮 Grooming Accessories
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-black text-white py-16">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-yellow-400 mb-8">
            Visit Our Shop
          </h2>

          <p className="text-lg leading-8">
            📍 Near VKR Hospital
            <br />
            Naganool Road
            <br />
            Nagarkurnool - 509209
          </p>

          <p className="mt-6 text-lg">
            📞 +91 96765 78296
          </p>

          <a
            href="https://wa.me/919676578296"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="mt-8 bg-green-500 hover:bg-green-600 px-8 py-4 rounded-xl text-lg font-bold transition">
              💬 Chat on WhatsApp
            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p>© 2026 Nithesh Cosmetics. All Rights Reserved.</p>
      </footer>
    </main>
  );
}