"use client";

import { Swiper, SwiperSlide } from "swiper/react";

import { useCallback, useRef, useEffect } from "react";

import Link from "next/link";

import "swiper/css/navigation";
import "swiper/css";

import SingleItem from "./SingleItem";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { useFetchAllCategories } from "@/hooks/useCategory";

const categoryImages = [
  "/images/categories/categories-01.png",

  "/images/categories/categories-02.png",

  "/images/categories/categories-03.png",
];

const Categories = () => {
  const sliderRef = useRef<any>(null);

  // fetch categories
  const { data: categories = [], isLoading } = useFetchAllCategories(true);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;

    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;

    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.swiper.init();
    }
  }, []);

  // format categories
  const formattedCategories =
    categories.map((category: any, index: number) => ({
      title: category.name,

      slug: category.slug,

      img: categoryImages[index % categoryImages.length],
    })) || [];

  return (
    <section className="overflow-hidden pt-17.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 pb-15 border-b border-gray-3">
        <div className="swiper categories-carousel common-carousel">
          {/* Title */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
                Categories
              </span>

              <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
                Browse by Category
              </h2>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <button onClick={handlePrev} className="swiper-button-prev">
                <FaArrowLeft />
              </button>

              <button onClick={handleNext} className="swiper-button-next">
                <FaArrowRight />
              </button>
            </div>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="text-center py-20">Loading...</div>
          ) : (
            <Swiper
              ref={sliderRef}
              slidesPerView={6}
              spaceBetween={20}
              breakpoints={{
                0: {
                  slidesPerView: 2,
                },

                768: {
                  slidesPerView: 3,
                },

                1000: {
                  slidesPerView: 4,
                },

                1200: {
                  slidesPerView: 6,
                },
              }}
            >
              {formattedCategories.map((item: any, key: number) => (
                <SwiperSlide key={key}>
                  <Link href={`/category/${item.slug}`}>
                    <SingleItem item={item} />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default Categories;
