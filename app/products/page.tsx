import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 via-white to-white px-4">
          <div className="text-center">

            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <h2 className="mt-5 text-lg sm:text-xl font-bold text-gray-800">
              Loading Products...
            </h2>

            <p className="mt-2 text-sm sm:text-base text-gray-500">
              Please wait while we load the latest products.
            </p>

          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}