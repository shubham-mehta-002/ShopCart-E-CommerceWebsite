import { MdKeyboardArrowDown } from "react-icons/md";
import { CiFilter } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { RxCross1 } from "react-icons/rx";
import { ProductCard } from "../Common/ProductCard";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllProductsAsync,
  fetchAllBrandsAsync,
  fetchAllCategoriesAsync,
} from "../Product/ProductSlice";
import { selectLoggedInUser } from "../Auth/AuthSlice";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { Link } from "react-router-dom";
import { selectSearchParameters } from "./ProductSlice";
import { useNavigate } from "react-router-dom";
import {Pagination} from "../Common/Pagination"

export function ProductList() {
  const state = useSelector((state) => state.product);
  const user = useSelector(selectLoggedInUser);
  console.log("productList admin", { user });

  const searchParameter = useSelector(selectSearchParameters);

  const dispatch = useDispatch();

  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const sortOptions = [
    { name: "Price: Low to High", sortBy: "price", order: "asc" },
    { name: "Price: High to Low", sortBy: "price", order: "desc" },
    { name: "Better Discount", sortBy: "discountPercentage", order: "desc" },
  ];

  const navigate = useNavigate();

  function addProductHandler() {
    navigate("/admin/products/create");
  }

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
          {sortOptions.map((sortOption) => (
            <div
              className={`flex p-2 items-center cursor-pointer text-slate-700 pl-4 text-md font-normal ${
                sort &&
                sortOption.sortBy === sort._sort &&
                sortOption.order === sort._order
                  ? "bg-gray-200"
                  : ""
              } `}
              onClick={() =>
                setSort({ _sort: sortOption.sortBy, _order: sortOption.order })
              }
            >
              {sortOption.name}
            </div>
          ))}
        </div>
      </div>
      <hr className="text-[#E5E7EB]" />

      <div className="mt-20 products-wrappper flex flex-row gap-20 relative">

        {/* filters -web view */}
        <DesktopFilters state={state} filterHandler={filterHandler} filter={filter} setFilter={setFilter} />

        {/* products */}
        <div className="wrapper w-[100%] lg:w-[70%]">
          {user && user.role === "admin" && (
            <button
              className="hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold px-4 py-2 mb-2 "
              onClick={addProductHandler}
            >
              Add Product
            </button>
          )}
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
            <div className="products-container w-full  grid grid-cols-1 vsm:grid-cols-2 xl:grid-cols-3 gap-y-5 gap-x-0 ">
              {state.products?.map((product) => (
                <Link to={`/products/${product._id}`}>
                  <ProductCard
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
            totalDocs={state.totalProducts}
            page={page}
            setPage={setPage}
          ></Pagination>
        </div>
      </div>

      {/* filters-mobile view */}
      <MobileFilters state={state} filterHandler={filterHandler} filter={filter} setFilter={setFilter} showMobileFilters={showMobileFilters} setShowMobileFilters={setShowMobileFilters} />
    </div>
  );
}

function DesktopFilters({ state, filter, setFilter ,filterHandler}) {
  const [showCategoryFilters, setShowCategoryFilters] = useState(false);
  const [showBrandFilters, setShowBrandFilters] = useState(false);



  return (
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
            <div className="block text-black text-lg">{state.error.brands}</div>
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
  );
}

function MobileFilters({ state ,filter,setFilter,setShowMobileFilters,showMobileFilters ,filterHandler}) {
  const [showMobileCategoryFilters, setShowMobileCategoryFilters] = useState(false);
  const [showMobileBrandFilters, setShowMobileShowBrandFilters] = useState(false);

  return (
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
      </div>
    </>
  );
}

