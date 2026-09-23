"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Search,
  SlidersHorizontal,
  Mic,
  X,
  Sparkles,
} from "lucide-react";

export default function SearchBar() {
  const router = useRouter();

  const [search, setSearch] =
    useState("");

  const [focused, setFocused] =
    useState(false);

  const [listening, setListening] =
    useState(false);

  function handleSearch(
    e: FormEvent
  ) {
    e.preventDefault();

    const value =
      search.trim();

    if (!value) {
      return;
    }

    router.push(
      `/products?search=${encodeURIComponent(
        value
      )}`
    );
  }

  function openProducts() {
    router.push("/products");
  }

  function clearSearch() {
    setSearch("");
  }

  /* =========================
     VOICE SEARCH
  ========================= */

  function startVoiceSearch() {
    const SpeechRecognition =
      (
        window as unknown as {
          SpeechRecognition?: new () => any;
          webkitSpeechRecognition?: new () => any;
        }
      ).SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition?: new () => any;
        }
      ).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice search is not supported in this browser."
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang =
      "en-IN";

    recognition.continuous =
      false;

    recognition.interimResults =
      false;

    recognition.onstart =
      () => {
        setListening(true);
      };

    recognition.onend =
      () => {
        setListening(false);
      };

    recognition.onerror =
      () => {
        setListening(false);
      };

    recognition.onresult =
      (event: any) => {
        const value =
          event.results?.[0]?.[0]
            ?.transcript;

        if (value) {
          setSearch(value);
        }
      };

    recognition.start();
  }

  return (
    <section
      className="
        relative
        w-full
        px-3
        sm:px-5
        lg:px-8
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >
        <form
          onSubmit={
            handleSearch
          }
          className="relative"
        >
          {/* Glow */}

          <div
            className={`
              pointer-events-none
              absolute
              inset-x-6
              -bottom-2
              h-10
              rounded-full
              bg-orange-400/15
              blur-2xl
              transition-opacity
              duration-300

              ${
                focused
                  ? "opacity-100"
                  : "opacity-0"
              }
            `}
          />

          <div
            className={`
              relative
              flex
              min-h-[58px]
              w-full
              items-center
              gap-2
              rounded-[22px]
              border
              bg-white/95
              px-2
              shadow-[0_10px_30px_rgba(15,23,42,0.08)]
              backdrop-blur-xl
              transition-all
              duration-300
              sm:min-h-[64px]
              sm:rounded-[26px]
              sm:px-3

              ${
                focused
                  ? "border-orange-300 shadow-[0_14px_40px_rgba(249,115,22,0.14)] ring-4 ring-orange-500/5"
                  : "border-gray-100"
              }
            `}
          >
            {/* Search icon */}

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-orange-50
                text-orange-500
                sm:h-11
                sm:w-11
              "
            >
              <Search
                size={19}
                strokeWidth={2.3}
              />
            </div>

            {/* Input */}

            <div
              className="
                min-w-0
                flex-1
              "
            >
              <div
                className="
                  hidden
                  items-center
                  gap-1
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.13em]
                  text-orange-400
                  sm:flex
                "
              >
                <Sparkles
                  size={10}
                />

                Find your products
              </div>

              <input
                type="search"
                value={search}
                placeholder="Search cosmetics, barber tools..."
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                onFocus={() =>
                  setFocused(true)
                }
                onBlur={() =>
                  setFocused(false)
                }
                autoComplete="off"
                className="
                  w-full
                  bg-transparent
                  py-2
                  text-sm
                  font-semibold
                  text-gray-900
                  outline-none
                  placeholder:font-normal
                  placeholder:text-gray-400
                  sm:py-1
                  sm:text-[15px]
                "
              />
            </div>

            {/* Clear */}

            {search && (
              <button
                type="button"
                onClick={
                  clearSearch
                }
                aria-label="Clear search"
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-gray-400
                  transition-all
                  hover:bg-gray-100
                  hover:text-gray-700
                  active:scale-90
                "
              >
                <X size={16} />
              </button>
            )}

            {/* Filters */}

            <button
              type="button"
              onClick={
                openProducts
              }
              aria-label="Browse and filter products"
              className="
                hidden
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-gray-50
                text-gray-500
                transition-all
                duration-300
                hover:bg-orange-50
                hover:text-orange-600
                active:scale-90
                xs:flex
                sm:h-11
                sm:w-11
              "
            >
              <SlidersHorizontal
                size={18}
              />
            </button>

            {/* Voice */}

            <button
              type="button"
              onClick={
                startVoiceSearch
              }
              aria-label="Voice search"
              className={`
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-2xl
                transition-all
                duration-300
                active:scale-90
                sm:h-11
                sm:w-11

                ${
                  listening
                    ? "voice-listening bg-red-50 text-red-500"
                    : "bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                }
              `}
            >
              <Mic
                size={18}
              />
            </button>

            {/* Search button */}

            <button
              type="submit"
              aria-label="Search products"
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-[16px]
                bg-gradient-to-br
                from-orange-500
                to-amber-500
                text-white
                shadow-[0_8px_22px_rgba(249,115,22,0.3)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_12px_28px_rgba(249,115,22,0.38)]
                active:scale-90
                sm:h-12
                sm:w-12
                sm:rounded-[18px]
              "
            >
              <Search
                size={19}
                strokeWidth={2.6}
              />
            </button>
          </div>
        </form>

        {/* Mobile suggestion */}

        {listening && (
          <div
            className="
              search-message
              mx-auto
              mt-2
              w-fit
              rounded-full
              border
              border-red-100
              bg-white
              px-3
              py-1.5
              text-[10px]
              font-bold
              text-red-500
              shadow-sm
            "
          >
            ðŸŽ™ Listening... say a product name
          </div>
        )}
      </div>

      
    </section>
  );
}
