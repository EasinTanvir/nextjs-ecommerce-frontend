"use client";

import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";

import { FaArrowUp } from "react-icons/fa";

import { useState } from "react";

interface Category {
  name: string;
  slug: string;
  products: number;
}

interface Props {
  categories: Category[];
}

const CategoryDropdown = ({ categories }: Props) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  const router = useRouter();

  const searchParams = useSearchParams();

  // selected categories from query
  const selectedCategories =
    searchParams.get("categories")?.split(",").filter(Boolean) || [];

  const handleCategoryToggle = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());

    let updatedCategories = [...selectedCategories];

    // remove if exists
    if (updatedCategories.includes(slug)) {
      updatedCategories = updatedCategories.filter((item) => item !== slug);
    } else {
      updatedCategories.push(slug);
    }

    // update query param
    if (updatedCategories.length > 0) {
      params.set("categories", updatedCategories.join(","));
    } else {
      params.delete("categories");
    }

    // reset page when filter changes
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white shadow-1 rounded-lg">
      {/* Header */}
      <div
        onClick={(e) => {
          e.preventDefault();

          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown ? "shadow-filter" : ""
        }`}
      >
        <p className="text-dark">Category</p>

        <button
          aria-label="button for category dropdown"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown ? "rotate-180" : ""
          }`}
        >
          <FaArrowUp />
        </button>
      </div>

      {/* Dropdown */}
      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        {categories.map((category) => {
          const selected = selectedCategories.includes(category.slug);

          return (
            <button
              key={category.slug}
              className={`${
                selected ? "text-blue" : ""
              } group flex items-center justify-between ease-out duration-200 hover:text-blue`}
              onClick={() => handleCategoryToggle(category.slug)}
            >
              <div className="flex items-center gap-2">
                {/* Checkbox */}
                <div
                  className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${
                    selected ? "border-blue bg-blue" : "bg-white border-gray-3"
                  }`}
                >
                  <svg
                    className={selected ? "block" : "hidden"}
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
                      stroke="white"
                      strokeWidth="1.94437"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <span>{category.name}</span>
              </div>

              {/* Count */}
              <span
                className={`${
                  selected ? "text-white bg-blue" : "bg-gray-2"
                } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
              >
                {category.products}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryDropdown;
