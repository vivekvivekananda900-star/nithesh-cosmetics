import Link from "next/link";

export default function LocationCard() {
  return (
    <section className="px-4 mt-10">
      <div className="bg-white rounded-3xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-4">
          📍 Visit Our Store
        </h2>

        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">Nithesh Cosmetics</span>
          </p>

          <p className="text-gray-600">
            VKR Hospital Road,
            Naganool Road,
            Nagarkurnool - 509209,
            Telangana, India
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">

            <Link
              href="https://maps.google.com/?q=VKR+Hospital+Road+Nagarkurnool+509209"
              target="_blank"
              className="flex-1 rounded-xl bg-blue-600 text-white py-3 text-center font-semibold hover:bg-blue-700 transition"
            >
              🗺️ Open in Maps
            </Link>

            <Link
              href="tel:+919676578296"
              className="flex-1 rounded-xl bg-green-600 text-white py-3 text-center font-semibold hover:bg-green-700 transition"
            >
              📞 Call Now
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}