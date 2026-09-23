"use client";

export default function FloatingWhatsApp() {
  const phone = "919676578296";

  const message = encodeURIComponent(
    "Hi! I'm interested in your products."
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Nithesh Cosmetics on WhatsApp"
      className="
        group
        fixed
        bottom-[104px]
        right-4
        z-[70]
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-gradient-to-br
        from-[#25D366]
        to-[#128C7E]
        shadow-[0_12px_35px_rgba(37,211,102,0.38)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:scale-110
        active:scale-95
        sm:bottom-6
        sm:right-6
        sm:h-16
        sm:w-16
      "
    >
      {/* Pulse */}

      <span
        className="
          pointer-events-none
          absolute
          inset-0
          animate-ping
          rounded-full
          bg-green-400/30
        "
      />

      {/* Border */}

      <span
        className="
          pointer-events-none
          absolute
          inset-[3px]
          rounded-full
          border
          border-white/20
        "
      />

      {/* Icon */}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="
          relative
          z-10
          h-8
          w-8
          fill-white
          drop-shadow-sm
          transition-transform
          duration-300
          group-hover:rotate-6
          group-hover:scale-105
          sm:h-9
          sm:w-9
        "
      >
        <path d="M19.11 17.42c-.29-.14-1.72-.85-1.99-.95-.27-.1-.46-.14-.66.14-.19.29-.76.95-.93 1.15-.17.19-.34.22-.63.07-.29-.14-1.23-.45-2.34-1.43-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.14-.66-1.59-.91-2.18-.24-.57-.48-.49-.66-.5h-.56c-.19 0-.51.07-.78.36-.27.29-1.03 1.01-1.03 2.47 0 1.46 1.06 2.87 1.21 3.07.14.19 2.08 3.18 5.03 4.46.7.3 1.24.48 1.66.61.7.22 1.33.19 1.83.12.56-.08 1.72-.7 1.97-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.19-.56-.34z" />

        <path d="M16.03 3C8.84 3 3 8.83 3 16c0 2.54.74 5.01 2.13 7.14L3 29l6.05-2.06A12.94 12.94 0 0 0 16.03 29C23.2 29 29 23.17 29 16S23.2 3 16.03 3zm0 23.62c-2.08 0-4.11-.56-5.88-1.62l-.42-.25-3.59 1.22 1.2-3.5-.27-.44A10.6 10.6 0 0 1 5.4 16c0-5.86 4.77-10.63 10.63-10.63S26.66 10.14 26.66 16 21.89 26.62 16.03 26.62z" />
      </svg>

      {/* Desktop Tooltip */}

      <div
        className="
          pointer-events-none
          absolute
          right-[72px]
          hidden
          translate-x-2
          whitespace-nowrap
          rounded-2xl
          border
          border-gray-100
          bg-white
          px-4
          py-2.5
          text-xs
          text-gray-800
          opacity-0
          shadow-lg
          transition-all
          duration-300
          group-hover:translate-x-0
          group-hover:opacity-100
          sm:block
        "
      >
        <p className="font-black">
          Need Help?
        </p>

        <p className="mt-0.5 text-[10px] text-gray-500">
          Chat with us on WhatsApp
        </p>
      </div>
    </a>
  );
}