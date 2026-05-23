"use client";

import Link from "next/link";

import ProductItem from "@/components/Common/ProductItem";

import { useFetchProducts } from "@/hooks/useFetchProducts";

import { productImages } from "@/utils/productImages";

const NewArrival = () => {
  const { data, isLoading } = useFetchProducts({
    page: 1,
    perPage: 8,
    sort: "latest",
  });
  console.log({ data });
  // attach frontend demo images
  const products =
    data?.data?.map((product: any, index: number) => ({
      ...product,

      title: product.name,

      reviews: Math.floor(Math.random() * 100),

      discountedPrice: Number(product.price) - Number(product.discount || 0),

      imgs: productImages[index % productImages.length],
    })) || [];
  console.log({ data });
  return (
    <section className="overflow-hidden pt-15">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* Section Title */}
        <div className="mb-7 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              This Week’s
            </span>

            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              New Arrivals
            </h2>
          </div>

          <Link
            href="/shop-with-sidebar"
            className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
            {products.map((item: any, key: number) => (
              <ProductItem item={item} key={key} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrival;
