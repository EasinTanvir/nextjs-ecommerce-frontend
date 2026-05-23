"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import CustomSelect from "./CustomSelect";
import { useSelector } from "react-redux";
import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import Image from "next/image";
import { useFetchAllCategories } from "@/hooks/useCategory";
import { FaCartPlus, FaPhone, FaSearch, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/utils/generateSlug";
import { signOut, useSession } from "next-auth/react";
import api from "@/api";
import toast from "react-hot-toast";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { openCartModal } = useCartModalContext();
  const router = useRouter();
  const { status, data } = useSession();
  console.log({ status });
  console.log({ data });
  console.log(data?.user);

  const { data: categories = [] } = useFetchAllCategories(true);

  const totalPrice = useSelector(selectTotalPrice);

  const handleOpenCartModal = () => {
    openCartModal();
  };

  // Sticky menu
  const handleStickyMenu = () => {
    if (window.scrollY >= 80) {
      setStickyMenu(true);
    } else {
      setStickyMenu(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
  });

  const options = [
    {
      label: "All Categories",
      value: "0",
      slug: "/",
    },

    ...categories.map((category) => ({
      label: category.name,
      value: String(category.id),
      slug: category.slug,
    })),
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    router.push(`/search/${generateSlug(searchQuery)}`);
  };

  const logOutHandler = async () => {
    const data = await signOut({
      redirect: false,
      callbackUrl: `/signin`,
    });

    router.push(data.url);
    router.refresh();
  };
  return (
    <header
      className={`fixed left-0 top-0 w-full z-9999 bg-white transition-all ease-in-out duration-300 ${
        stickyMenu && "shadow"
      }`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        {/* <!-- header top start --> */}
        <div
          className={`flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between ease-out duration-200 ${
            stickyMenu ? "py-4" : "py-6"
          }`}
        >
          {/* <!-- header top left --> */}
          <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-5 sm:gap-10">
            <Link className="flex-shrink-0" href="/">
              <h3 className="text-gray-7 text-3xl font-bold">ProShop</h3>
            </Link>

            <div className="max-w-[475px] w-full">
              <form onSubmit={handleSearch}>
                <div className="flex items-center">
                  <CustomSelect options={options} />
                  <div className="relative max-w-[333px] sm:min-w-[333px] w-full">
                    {/* <!-- divider --> */}
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5.5 bg-gray-4"></span>
                    <input
                      onChange={(e) => setSearchQuery(e.target.value)}
                      value={searchQuery}
                      type="search"
                      name="search"
                      id="search"
                      placeholder="Search here..."
                      autoComplete="off"
                      className="custom-search w-full rounded-r-[5px] bg-gray-1 !border-l-0 border border-gray-3 py-2.5 pl-4 pr-10 outline-none ease-in duration-200"
                    />

                    <button
                      type="submit"
                      id="search-btn"
                      aria-label="Search"
                      className="flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 ease-in duration-200 hover:text-blue"
                    >
                      <FaSearch />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* <!-- header top right --> */}
          <div className="flex w-full lg:w-auto items-center gap-7.5">
            {/* <!-- divider --> */}
            <span className="hidden xl:block w-px h-7.5 bg-gray-4"></span>

            <div className="flex w-full lg:w-auto justify-between items-center gap-5">
              <div className="flex items-center gap-5">
                {status === "authenticated" ? (
                  <div className="relative group">
                    <button className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-dark text-white flex items-center justify-center font-semibold uppercase">
                        {data?.user?.name?.charAt(0)}
                      </div>

                      {/* User Info */}
                      <div className="text-left hidden sm:block">
                        <span className="block text-2xs text-dark-4 uppercase">
                          Welcome
                        </span>

                        <p className="font-medium text-custom-sm text-dark line-clamp-1">
                          {data?.user?.name}
                        </p>
                      </div>
                    </button>

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-3 w-[220px] rounded-xl border border-gray-2 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-4 border-b border-gray-2">
                        <p className="font-medium text-dark">
                          {data?.user?.name}
                        </p>

                        <p className="text-sm text-dark-4 break-all">
                          {data?.user?.email}
                        </p>
                      </div>

                      <div className="p-2">
                        <button onClick={logOutHandler}>Logout</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href="/signin" className="flex items-center gap-2.5">
                    <FaUser />

                    <div>
                      <span className="block text-2xs text-dark-4 uppercase">
                        account
                      </span>

                      <p className="font-medium text-custom-sm text-dark">
                        Sign In
                      </p>
                    </div>
                  </Link>
                )}

                <button
                  onClick={handleOpenCartModal}
                  className="flex items-center gap-2.5"
                >
                  <FaCartPlus />
                  <div>
                    <span className="block text-2xs text-dark-4 uppercase">
                      cart
                    </span>
                    <p className="font-medium text-custom-sm text-dark">
                      ${totalPrice}
                    </p>
                  </div>
                </button>
              </div>

              {/* <!-- Hamburger Toggle BTN --> */}
              <button
                id="Toggle"
                aria-label="Toggler"
                className="xl:hidden block"
                onClick={() => setNavigationOpen(!navigationOpen)}
              >
                <span className="block relative cursor-pointer w-5.5 h-5.5">
                  <span className="du-block absolute right-0 w-full h-full">
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-[0] ${
                        !navigationOpen && "!w-full delay-300"
                      }`}
                    ></span>
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-150 ${
                        !navigationOpen && "!w-full delay-400"
                      }`}
                    ></span>
                    <span
                      className={`block relative top-0 left-0 bg-dark rounded-sm w-0 h-0.5 my-1 ease-in-out duration-200 delay-200 ${
                        !navigationOpen && "!w-full delay-500"
                      }`}
                    ></span>
                  </span>

                  <span className="block absolute right-0 w-full h-full rotate-45">
                    <span
                      className={`block bg-dark rounded-sm ease-in-out duration-200 delay-300 absolute left-2.5 top-0 w-0.5 h-full ${
                        !navigationOpen && "!h-0 delay-[0] "
                      }`}
                    ></span>
                    <span
                      className={`block bg-dark rounded-sm ease-in-out duration-200 delay-400 absolute left-0 top-2.5 w-full h-0.5 ${
                        !navigationOpen && "!h-0 dealy-200"
                      }`}
                    ></span>
                  </span>
                </span>
              </button>
              {/* //   <!-- Hamburger Toggle BTN --> */}
            </div>
          </div>
        </div>
        {/* <!-- header top end --> */}
      </div>
    </header>
  );
};

export default Header;
