"use client";

import { useState, useEffect } from "react";

import Breadcrumb from "../Common/Breadcrumb";
import CustomSelect from "./CustomSelect";
import CategoryDropdown from "./CategoryDropdown";
import ColorsDropdwon from "./ColorsDropdwon";
import PriceDropdown from "./PriceDropdown";

import SingleGridItem from "../Shop/SingleGridItem";
import SingleListItem from "../Shop/SingleListItem";

import { MdGridView } from "react-icons/md";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { CiGrid2H } from "react-icons/ci";

import { useFetchAllCategories } from "@/hooks/useCategory";
import { useFetchCategoryProducts } from "@/hooks/useFetchCategoryProducts";
import { productImages } from "@/utils/productImages";

const ShopWithSidebar = ({ categorySlug }: { categorySlug: string }) => {
  const [productStyle, setProductStyle] = useState("grid");

  const [productSidebar, setProductSidebar] = useState(false);

  const [stickyMenu, setStickyMenu] = useState(false);

  const [page, setPage] = useState(1);

  const [minPrice, setMinPrice] = useState<number>();

  const [maxPrice, setMaxPrice] = useState<number>();

  const [sort, setSort] = useState("latest");

  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);

    function handleClickOutside(event: any) {
      if (!event.target.closest(".sidebar-content")) {
        setProductSidebar(false);
      }
    }

    if (productSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleStickyMenu);

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productSidebar]);

  // fetch categories
  const { data: categoriesData = [] } = useFetchAllCategories(true);

  // fetch category products
  const { data, isLoading } = useFetchCategoryProducts({
    slug: categorySlug,
    page,
    perPage: 8,
    minPrice,
    maxPrice,
    sort,
  });

  // sort options
  const options = [
    {
      label: "Latest Products",
      value: "latest",
      slug: "",
    },

    {
      label: "Old Products",
      value: "oldest",
      slug: "",
    },
  ];

  // categories dropdown
  const categories =
    categoriesData.map((category: any) => ({
      name: category.name,
      products: 0,
      isRefined: category.slug === categorySlug,
      slug: category.slug,
    })) || [];

  // attach frontend images to backend products
  const products =
    data?.products?.map((product: any, index: number) => ({
      ...product,

      title: product.name,

      reviews: Math.floor(Math.random() * 100),

      discountedPrice: Number(product.price) - Number(product.discount || 0),

      imgs: productImages[index % productImages.length],
    })) || [];

  return (
    <>
      <Breadcrumb
        title={data?.category?.name || "Explore Products"}
        pages={["category", "/", categorySlug]}
      />

      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex gap-7.5">
            {/* Sidebar */}
            <div
              className={`sidebar-content fixed xl:z-1 z-9999 left-0 top-0 xl:translate-x-0 xl:static max-w-[310px] xl:max-w-[270px] w-full ease-out duration-200 ${
                productSidebar
                  ? "translate-x-0 bg-white p-5 h-screen overflow-y-auto"
                  : "-translate-x-full"
              }`}
            >
              <button
                onClick={() => setProductSidebar(!productSidebar)}
                aria-label="button for product sidebar toggle"
                className={`xl:hidden absolute -right-12.5 sm:-right-8 flex items-center justify-center w-8 h-8 rounded-md bg-white shadow-1 ${
                  stickyMenu
                    ? "lg:top-20 sm:top-34.5 top-35"
                    : "lg:top-24 sm:top-39 top-37"
                }`}
              >
                <FaArrowLeft />
              </button>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="flex flex-col gap-6">
                  {/* Filter */}
                  <div className="bg-white shadow-1 rounded-lg py-4 px-5">
                    <div className="flex items-center justify-between">
                      <p>Filters:</p>

                      <button
                        onClick={() => {
                          setMinPrice(undefined);

                          setMaxPrice(undefined);

                          setSort("latest");

                          setPage(1);
                        }}
                        className="text-blue"
                      >
                        Clean All
                      </button>
                    </div>
                  </div>

                  {/* Categories */}
                  <CategoryDropdown categories={categories} />

                  {/* Colors */}
                  <ColorsDropdwon />

                  {/* Price */}
                  <PriceDropdown
                    setMinPrice={setMinPrice}
                    setMaxPrice={setMaxPrice}
                  />
                </div>
              </form>
            </div>

            {/* Content */}
            <div className="xl:max-w-[870px] w-full">
              {/* Top Bar */}
              <div className="rounded-lg bg-white shadow-1 pl-3 pr-2.5 py-2.5 mb-6">
                <div className="flex items-center justify-between">
                  {/* Left */}
                  <div className="flex flex-wrap items-center gap-4">
                    <CustomSelect
                      options={options}
                      onChange={(option) => {
                        setSort(option.value);

                        setPage(1);
                      }}
                    />

                    <p>
                      Showing{" "}
                      <span className="text-dark">{products.length}</span> of{" "}
                      <span className="text-dark">
                        {data?.pagination?.total}
                      </span>{" "}
                      Products
                    </p>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setProductStyle("grid")}
                      aria-label="grid"
                      className={`${
                        productStyle === "grid"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <MdGridView />
                    </button>

                    <button
                      onClick={() => setProductStyle("list")}
                      aria-label="list"
                      className={`${
                        productStyle === "list"
                          ? "bg-blue border-blue text-white"
                          : "text-dark bg-gray-1 border-gray-3"
                      } flex items-center justify-center w-10.5 h-9 rounded-[5px] border ease-out duration-200 hover:bg-blue hover:border-blue hover:text-white`}
                    >
                      <CiGrid2H />
                    </button>
                  </div>
                </div>
              </div>

              {/* Loading */}
              {isLoading ? (
                <div className="text-center py-20">Loading...</div>
              ) : (
                <>
                  {/* Products */}
                  <div
                    className={`${
                      productStyle === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-9"
                        : "flex flex-col gap-7.5"
                    }`}
                  >
                    {products.map((item: any, key: number) =>
                      productStyle === "grid" ? (
                        <SingleGridItem item={item} key={key} />
                      ) : (
                        <SingleListItem item={item} key={key} />
                      ),
                    )}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center mt-15">
                    <div className="bg-white shadow-1 rounded-md p-2">
                      <ul className="flex items-center gap-2">
                        {/* Prev */}
                        <li>
                          <button
                            onClick={() =>
                              setPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={page === 1}
                            className="flex items-center justify-center w-8 h-9 rounded-[3px] disabled:text-gray-4 hover:text-white hover:bg-blue"
                          >
                            <FaArrowLeft />
                          </button>
                        </li>

                        {/* Pages */}
                        {Array.from({
                          length: data?.pagination?.last_page || 1,
                        }).map((_, index) => (
                          <li key={index}>
                            <button
                              onClick={() => setPage(index + 1)}
                              className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${
                                page === index + 1
                                  ? "bg-blue text-white"
                                  : "hover:text-white hover:bg-blue"
                              }`}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}

                        {/* Next */}
                        <li>
                          <button
                            onClick={() =>
                              setPage((prev) =>
                                Math.min(prev + 1, data?.pagination?.last_page),
                              )
                            }
                            disabled={page === data?.pagination?.last_page}
                            className="flex items-center justify-center w-8 h-9 rounded-[3px] disabled:text-gray-4 hover:text-white hover:bg-blue"
                          >
                            <FaArrowRight />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default ShopWithSidebar;
