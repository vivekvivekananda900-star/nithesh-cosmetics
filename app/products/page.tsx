import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

function ProductsLoading() {
  return (
    <main
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#fffaf5]
        via-[#fff7f0]
        to-white
        px-3
        pb-28
        pt-6
        sm:px-5
        lg:px-8
      "
    >
      <div className="mx-auto max-w-7xl">

        {/* Header Loading */}

        <div className="mb-6">

          <div
            className="
              h-3
              w-28
              animate-pulse
              rounded-full
              bg-orange-100
            "
          />

          <div
            className="
              mt-3
              h-8
              w-52
              animate-pulse
              rounded-xl
              bg-gray-200
            "
          />

          <div
            className="
              mt-3
              h-4
              w-72
              max-w-full
              animate-pulse
              rounded-lg
              bg-gray-100
            "
          />

        </div>

        {/* Search / Filter Loading */}

        <div
          className="
            mb-6
            flex
            gap-3
          "
        >
          <div
            className="
              h-14
              flex-1
              animate-pulse
              rounded-2xl
              bg-white
              shadow-sm
            "
          />

          <div
            className="
              h-14
              w-14
              animate-pulse
              rounded-2xl
              bg-orange-100
            "
          />

        </div>

        {/* Products Grid */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:gap-5
            md:grid-cols-3
            lg:grid-cols-4
          "
        >
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div
              key={index}
              className="
                overflow-hidden
                rounded-[24px]
                border
                border-gray-100
                bg-white
                shadow-sm
              "
            >
              <div
                className="
                  h-40
                  animate-pulse
                  bg-gray-100
                  sm:h-52
                "
              />

              <div className="p-3 sm:p-4">

                <div
                  className="
                    h-4
                    w-full
                    animate-pulse
                    rounded-md
                    bg-gray-200
                  "
                />

                <div
                  className="
                    mt-2
                    h-4
                    w-2/3
                    animate-pulse
                    rounded-md
                    bg-gray-100
                  "
                />

                <div
                  className="
                    mt-4
                    h-6
                    w-20
                    animate-pulse
                    rounded-lg
                    bg-orange-100
                  "
                />

                <div
                  className="
                    mt-4
                    h-11
                    w-full
                    animate-pulse
                    rounded-xl
                    bg-orange-100
                  "
                />

              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={<ProductsLoading />}
    >
      <ProductsContent />
    </Suspense>
  );
}