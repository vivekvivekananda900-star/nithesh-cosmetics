export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-100">

      <section className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-yellow-400">
            Contact Us
          </h1>
          <p className="mt-4 text-lg">
            We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10">

        {/* Contact Details */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6">
            Contact Information
          </h2>

          <p className="mb-4">
            <strong>🏪 Shop:</strong> Nithesh Cosmetics
          </p>

          <p className="mb-4">
            <strong>📍 Address:</strong><br />
            Near VKR Hospital,<br />
            Naganool Road,<br />
            Nagarkurnool - 509209
          </p>

          <p className="mb-4">
            <strong>📞 Phone:</strong> +91 9676578296
          </p>

          <p className="mb-6">
            <strong>📧 Email:</strong> info@nitheshcosmetics.com
          </p>

          <a
            href="https://wa.me/919676578296"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600">
              WhatsApp Us
            </button>
          </a>
        </div>

        {/* Google Map */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps?q=Nagarkurnool&output=embed"
            width="100%"
            height="450"
            loading="lazy"
            className="border-0"
          />
        </div>

      </section>

    </main>
  );
}