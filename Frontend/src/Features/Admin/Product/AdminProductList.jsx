import { MdKeyboardArrowDown } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { AdminProductCard } from "./AdminProductCard";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllProductsAsync,
  fetchAllBrandsAsync,
  fetchAllCategoriesAsync,
} from "../../Product/ProductSlice";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { ITEMS_PER_PAGE } from "../../../constants";
import { Link } from "react-router-dom";
import { selectSearchParameters } from "../../Product/ProductSlice";

export function AdminProductList() {
  const state = useSelector((state) => state.product);
  // console.log({ state })
  const searchParameter = useSelector(selectSearchParameters);
  // console.log("je hito ja", { searchParameter });
  const dispatch = useDispatch();


  
  
  
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [filter, setFilter] = useState({ category: [], brand: [] });
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);


  useEffect(() => {
    const timeOut = setTimeout(() => {
      dispatch(fetchAllProductsAsync({ filter, page, sort, searchParameter }));
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, [filter, page, sort, searchParameter]);



  useEffect(() => {
    dispatch(fetchAllBrandsAsync());
    dispatch(fetchAllCategoriesAsync());
  }, [dispatch]);

  const filterHandler = (value, filterType) => {
    const isFilterAlreadySelected = filter[filterType].find(
      (val) => val === value
    );
    let newFilters = [];
    if (isFilterAlreadySelected) {
      newFilters = {
        ...filter,
        [filterType]: [...filter[filterType].filter((val) => val !== value)],
      };
    } else {
      newFilters = { ...filter, [filterType]: [...filter[filterType], value] };
    }

    setFilter(newFilters);
  };

  const sortOptions = [
    { name: "Price: Low to High", sortBy: "price", order: "asc" },
    { name: "Price: High to Low", sortBy: "price", order: "desc" },
    { name: "Better Discount", sortBy: "discountPercentage", order: "desc" },
  ];


  return (
    <div className="px-5 w-full md:mx-auto  md:w-[90%]  bg-white mx-auto ">
      {/* header */}
      <div className="header mt-[60px] h-[80px] flex flex-row items-center justify-between gap-10 relative">
        <div className="w-[50%] text-4xl font-bold text-left">All Products</div>
        <div className="flex flex-row items-center gap-2 cursor-pointer">
          <span
            className="text-xl"
            onClick={() => setShowSortMenu((prevValue) => !prevValue)}
          >
            Sort
          </span>
          <span>
            <MdKeyboardArrowDown
              className="h-6 w-6"
              onClick={() => setShowSortMenu((prevValue) => !prevValue)}
            />
          </span>
          <span>
            <CiFilter
              className="ml-1 h-6 w-6 lg:hidden"
              onClick={() => setShowMobileFilters((prevValue) => !prevValue)}
            />
          </span>
        </div>

        {/* sort drop-down menu  */}
        <div
          className={`${
            showSortMenu ? "flex" : "hidden"
          } sort-menu h-[120px] w-[200px] absolute top-[90%] right-0 z-10 bg-white  shadow-2xl rounded-md border-2 border-gray-200 flex flex-col justify-around`}
        >
          {sortOptions.map((sort) => (
            <div
              className="flex items-center cursor-pointer text-slate-700 pl-4 text-md font-normal"
              onClick={() =>
                setSort({ _sort: sort.sortBy, _order: sort.order })
              }
            >
              {sort.name}
            </div>
          ))}
          
        </div>
      </div>
      <hr className="text-[#E5E7EB]" />

      <div className="mt-20 products-wrappper flex flex-row gap-20 relative">
        {/* filters -web view */}
        

        {/* products */}
        <div className="wrapper w-[100%] lg:w-[70%]">
          {state.status.products === "loading" && (
            <p className="text-black text-3xl font-semibold">Loading ...</p>
          )}
          {state.error.products && (
            <div className="block text-black text-3xl font-semibold">
              {state.error.products}
            </div>
          )}

          {state.products && state.products.length === 0 ? (
            <div className="block text-black text-3xl font-semibold">
              No product found{" "}
            </div>
          ) : (
            <div className="products-container w-full h-full grid grid-cols-1 vsm:grid-cols-2 xl:grid-cols-3 gap-y-5 gap-x-0 ">
              {state.products?.map((product) => (
                <Link to={`/products/${product._id}`}>
                  <AdminProductCard
                    key={product.id}
                    {...product}
                    className="h-[300px] sm:h-[340px] sm:w-72 "
                  />
                </Link>
              ))}
            </div>
          )}

          <hr className="mt-10 border-gray-400"></hr>
          <Pagination
            totalProducts={state.totalProducts}
            page={page}
            setPage={setPage}
          ></Pagination>
        </div>
      </div>


      {/* filters-mobile view */}
      <MobileFilters />
    </div>
  );
}

function DesktopFilters(){
  
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);
  const [showBrandFilters, setShowBrandFilters] = useState(false);
  return(
    <>
    <div className="filters hidden lg:block w-[25%] ">
          <div
            className="text-black flex flex-row justify-between px-3 py-4 cursor-pointer"
            onClick={() => setShowCategoryFilters((prevValue) => !prevValue)}
          >
            <span className="font-semibold text-xl">Category</span>
            <span className="font-semibold text-lg">
              {showCategoryFilters ? <FaMinus /> : <FaPlus />}
            </span>
          </div>
          {/* category filters */}
          <div
            className={`${
              showCategoryFilters ? "flex" : "hidden"
            } category-filters-wrapper w-[100%] flex flex-col items-center `}
          >
            {state.error.categories && (
              <div className="block text-black text-lg ">
                {state.error.categories}
              </div>
            )}
            {state.filters.categories === undefined ? (
              <p>No category found</p>
            ) : (
              state.filters.categories.map(({ label, value }) => {
                return (
                  <label
                    key={uuid()}
                    className="flex w-full flex-row items-center gap-3 h-[40px]"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      value={value}
                      checked={filter.category.includes(value)}
                      onChange={(e) => filterHandler(value, "category")}
                    />
                    <span className="font-light text-lg flex flex-row">
                      {label}
                    </span>
                  </label>
                );
              })
            )}
          </div>

          <hr className="text-[#E5E7EB]" />

          {/* brand filters */}
          <div
            className="text-black flex flex-row justify-between px-3 py-4 cursor-pointer"
            onClick={() => setShowBrandFilters((prevValue) => !prevValue)}
          >
            <span className="font-semibold text-xl">Brands</span>
            <span className="font-semibold text-lg text-center">
              {showBrandFilters ? <FaMinus /> : <FaPlus />}
            </span>
          </div>

          <div
            className={`${
              showBrandFilters ? "flex" : "hidden"
            } brand-filters-wrapper w-[100%] flex flex-col items-center`}
          >
            {state.error.brands && (
              <div className="block text-black text-lg">
                {state.error.brands}
              </div>
            )}
            {state.filters.brands === undefined ? (
              <p>No brand found</p>
            ) : (
              state.filters.brands.map(({ label, value }) => (
                <label className="flex flex-row items-center w-full gap-3 min-h-[40px]">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    value={value}
                    checked={filter.brand.includes(value)}
                    onChange={(e) => filterHandler(value, "brand")}
                  />
                  <span className="font-light text-lg">{label}</span>
                </label>
              ))
            )}
          </div>
          <hr className="text-[#E5E7EB]" />
        </div>
    </>
  )
}

function MobileFilters(){
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileCategoryFilters, setShowMobileCategoryFilters] =useState(false);
  const [showMobileBrandFilters, setShowMobileShowBrandFilters] = useState(false);
  return(
    <>
    <div
        className={`${
          showMobileFilters ? "flex" : "hidden "
        } lg:hidden mobile-filters-container h-full
      w-full vsm:w-[380px]  shadow-2xl top-0 right-0 fixed bg-white z-50 flex flex-col overflow-y-scroll`}
      >
        <div className="h-[80px] flex flex-row justify-between items-center p-5 ">
          <span className="font-semibold text-xl">Filters</span>
          <RxCross1
            className="font-semibold text-xl cursor-pointer"
            onClick={() => setShowMobileFilters((prevValue) => !prevValue)}
          />
        </div>

        <hr className=" border-gray-400" />

        <div
          className="h-[80px] flex flex-row justify-between items-center p-5 "
          onClick={() =>
            setShowMobileCategoryFilters((prevValue) => !prevValue)
          }
        >
          <span className="font-semibold text-xl">Category</span>
          {showMobileCategoryFilters ? (
            <FaMinus className="font-semibold text-xl cursor-pointer" />
          ) : (
            <FaPlus className="font-semibold text-xl cursor-pointer" />
          )}
        </div>
        <div
          className={`${
            showMobileCategoryFilters ? "flex" : "hidden"
          } category-filters-wrapper w-[100%] flex flex-col items-center pl-4 pb-4`}
        >
          {state.error.categories && (
            <div className="block text-black text-lg">
              {state.error.categories}
            </div>
          )}
          {state.filters.categories === undefined ? (
            <p>No category found</p>
          ) : (
            state.filters.categories.map(({ value, label }) => (
              <div className="flex flex-row w-full items-center  gap-3 h-[40px]">
                <input type="checkbox" className="h-4 w-4" value={value} />
                <label className="font-light text-lg">{label}</label>
              </div>
            ))
          )}
        </div>
        <hr className=" border-gray-400" />

        <div
          className="h-[80px] flex flex-row justify-between items-center p-5 "
          onClick={() =>
            setShowMobileShowBrandFilters((prevValue) => !prevValue)
          }
        >
          <span className="font-semibold text-xl">Brand</span>
          {showMobileBrandFilters ? (
            <FaMinus className="font-semibold text-xl cursor-pointer" />
          ) : (
            <FaPlus className="font-semibold text-xl cursor-pointer" />
          )}
        </div>
        <div
          className={`${
            showMobileBrandFilters ? "flex" : "hidden"
          } brand-filters-wrapper w-[100%] flex flex-col items-center pl-4 pb-4`}
        >
          {state.error.brands && (
            <div className="block text-black text-lg">{state.error.brands}</div>
          )}
          {state.filters.brands === undefined ? (
            <p>No brand found</p>
          ) : (
            state.filters.brands.map(({ label, value }) => (
              <div className="flex flex-row w-full items-center  gap-3 h-[40px]">
                <input type="checkbox" className="h-4 w-4" value={value} />
                <label className="font-light text-lg">{label}</label>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

function Pagination({ totalProducts, page, setPage }) {
  const numberOfPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const pageNumberArray = [];
  for (let i = 0; i < numberOfPages; i++) pageNumberArray.push(i + 1);

  function handlePage(page) {
    setPage(page);
  }
  useEffect(() => {
    setPage(1);
  }, [totalProducts]);
  return (
    <div className="my-10 w-full flex sm:flex-row justify-between flex-col">
      <div className="total-items flex items-center justify-center">
        Showing{" "}
        <span className="font-bold">
          &nbsp;{(page - 1) * ITEMS_PER_PAGE + 1}&nbsp;{" "}
        </span>{" "}
        to{" "}
        <span className="font-bold">
          &nbsp;
          {page * ITEMS_PER_PAGE > totalProducts
            ? totalProducts
            : page * ITEMS_PER_PAGE}
        </span>
        &nbsp;of&nbsp;<span className="font-bold">{totalProducts}</span>
        &nbsp;results
      </div>
      <div className="flex items-center justify-center">
        <button
          className={`h-10 w-10 mx-3 border-2 border-gray-400 text-xl ${
            page == 1 ? "cursor-not-allowed bg-[#dedede] " : "cursor-pointed"
          } `}
          disabled={page == 1}
          onClick={() => handlePage(page - 1)}
        >
          &lt;
        </button>
        {pageNumberArray
          .slice(
            Math.max(0, page - 3),
            Math.min(page + 2, pageNumberArray.length)
          )
          .map((pageNumber) => {
            return (
              <button
                className={`h-10 w-10 p-3 ${
                  page === pageNumber
                    ? "bg-[rgb(79,70,229)]"
                    : "bg-white border-2"
                } flex items-center justify-center`}
                onClick={() => handlePage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
        <button
          className={`h-10 w-10 mx-3 border-2 border-gray-400 text-xl ${
            page == pageNumberArray.length
              ? "cursor-not-allowed bg-[#dedede] "
              : "cursor-pointed"
          }`}
          disabled={page == pageNumberArray.length}
          onClick={() => handlePage(page + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

