"use client";

import Link from "next/link";
import { MapPin, Phone, Navigation } from "lucide-react";

export default function LocationCard() {
  return (
    <section className="px-3 sm:px-4 mt-8 mb-8">
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-yellow-500 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-xl">

        {/* Header */}
        <div className="flex items-center gap-3">

          <div className="bg-white/20 p-3 rounded-2xl">
            <MapPin size={26} className="sm:w-8 sm:h-8" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Visit Our Store
            </h2>

            <p className="text-white/90 text-xs sm:text-sm">
              Nithesh Cosmetics
            </p>
          </div>

        </div>

        {/* Address Card */}
        <div className="mt-5 bg-white rounded-2xl p-4 sm:p-5 text-gray-800 shadow-lg">

          <h3 className="font-bold text-lg sm:text-xl">
            Nithesh Cosmetics
          </h3>

          <p className="mt-2 text-sm sm:text-base text-gray-600 leading-6">
            VKR Hospital Road,
            <br />
            Naganool Road,
            <br />
            Nagarkurnool - 509209,
            <br />
            Telangana, India
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">

            <Link
              href="https://maps.google.com/?q=VKR+Hospital+Road+Nagarkurnool+509209"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              <Navigation size={18} />
              Get Directions
            </Link>

            <Link
              href="tel:+919676578296"
              className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              <Phone size={18} />
              Call Now
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}