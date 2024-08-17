import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  fetchAllBrandsAsync,
  fetchAllCategoriesAsync,
  selectCategories,
  selectBrands,
  addBrandAsync,
  addCategoryAsync
} from "../../Product/ProductSlice";
import { uploadOnCloudinary } from "../../../utils/uploadOnCloudinary";
import { FaCloudUploadAlt } from "react-icons/fa";
import { createProductAsync } from "../AdminSlice";
import { useNavigate } from "react-router-dom";

export function AdminCreateProductForm() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      variations: [
        { size: "", colors: [{ color: "", colorCode: "", stock: "" }] },
      ],
      deleted: false,
    },
  });

  const brands = useSelector(selectBrands);
  const categories = useSelector(selectCategories);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');

  const navigate = useNavigate()
  
  useEffect(() => {
    dispatch(fetchAllBrandsAsync());
    dispatch(fetchAllCategoriesAsync());
  }, [dispatch]);

  const validations = {
    title: {
      required: "Title is required",
      validate: {
        isEmpty: (value) => (value.trim() ? true : "Can't be empty "),
      },
    },
    price: {
      required: "Price is required",
      min: {
        value: 0,
        message: "Price cannot be less than $0",
      },
      validate: {
        isDecimal: (value) =>
          !isNaN(value) || "Enter a valid price value (e.g., 120.00)",
        // isEmpty : (value) => value.trim() || "Can't be empty "
      },
    },
    discountPercentage: {
      required: "Discount percentage is required",
      min: {
        value: 0,
        message: "Discount percentage cannot be less than 0",
      },
      max: {
        value: 100,
        message: "Discount percentage cannot be more than 100",
      },
      validate: {
        isDecimal: (value) =>
          !isNaN(value) || "Enter a valid value (e.g., 12.34)",
      },
    },
    description: {
      required: "Description is required",
      validate: {
        isEmpty: (value) => (value.trim() ? true : "Can't be empty "),
      },
    },
    brand: {
      required: "Brand is required",
    },
    category: {
      required: "Category is required",
    },
    variations: {
      validate: {
        atLeastOne: (value) =>
          value.length > 0 ? true : "At least one variation is required",
      },
    },
  };

  const imageUploadRefs = useRef([]);
  const thumbnailRef = useRef(null);

  const [uploading, setUploading] = useState({
    thumbnail: false,
    images: new Array(4).fill(false),
  });

  function imageUploadClickHandler(e, index) {
    imageUploadRefs.current[index]?.click();
  }

  async function uploadImageOnCloudinaryHandler(e, index) {
    setUploading((prev) => ({
      ...prev,
      images: prev.images.map((uploadingStatus, idx) =>
        idx === index ? true : uploadingStatus
      ),
    }));
    const url = await uploadOnCloudinary(e.target.files[0]);

    const images = getValues().images.map((img, imgIndex) => {
      if (imgIndex === index) {
        return url;
      } else {
        return img;
      }
    });
    setValue("images", images);
    setUploading((prev) => ({
      ...prev,
      images: prev.images.map((uploadingStatus, idx) =>
        idx === index ? false : uploadingStatus
      ),
    }));
  }

  function thumbnailUploadClickHandler(e) {
    thumbnailRef.current.click();
  }

  async function uploadThumbnailOnCloudinaryHandler(e) {
    setUploading((prev) => ({
      ...prev,
      thumbnail: true,
    }));
    const url = await uploadOnCloudinary(e.target.files[0]);
    setValue("thumbnail", url);
    setUploading((prev) => ({
      ...prev,
      thumbnail: false,
    }));
  }

  function removeColorsField(variationIndex, colorFieldIndex) {
    const currentVariations = watch("variations");
    const newVariations = currentVariations
      .map((variation, index) => {
        if (index === variationIndex) {
          const updatedColors = variation.colors.filter(
            (_, index) => index !== colorFieldIndex
          );
          if (updatedColors.length === 0) {
            return null; // If no colors left, return null to remove this variation
          }
          return {
            ...variation,
            colors: updatedColors,
          };
        }
        return variation;
      })
      .filter(Boolean); // Filter out null variations

    setValue("variations", newVariations);
  }

  function addColorsField(variationIndex) {
    const currentVariations = watch("variations");
    const newVariations = currentVariations.map((variation, index) => {
      if (index === variationIndex) {
        return {
          ...variation,
          colors: [...variation.colors, { color: "", colorCode: "", stock: 1 }],
        };
      }
      return variation;
    });

    setValue("variations", newVariations);
  }

  function addVariationHandler() {
    const variations = watch("variations") || [];
    if (variations.some((variation) => !variation.size.trim())) {
      alert("Please fill in the size for all variations.");
      return;
    }
    const newVariation = {
      size: "",
      colors: [{ color: "", colorCode: "", stock: 0 }],
    };
    setValue("variations", [...variations, newVariation]);
  }

  function removeVariationHandler(variationIndex) {
    const newVariations = watch("variations").filter(
      (_, index) => index !== variationIndex
    );
    setValue("variations", newVariations);
  }

  const formSubmitHandler = (data) => {
    if (data.variations.length === 0) {
      alert("Enter atleast one variations ");
      return;
    }
    let hasEmptyFields = false;
    data.variations.forEach((variation, variationIndex) => {
      variation.colors.forEach((color, colorFieldIndex) => {
        if (!color.color || !color.colorCode) {
          hasEmptyFields = true;
        }
      });
    });

    if (hasEmptyFields) {
      alert("Please fill in all color fields.");
      return;
    }
    const totalStock = data.variations.reduce((acc, curr) => {
      return (
        acc +
        curr.colors.reduce((innerAcc, color) => {
          return innerAcc + parseInt(color.stock);
        }, 0)
      );
    }, 0);

    const product = {
      ...data,
      stock: totalStock,
    };
    dispatch(createProductAsync({ product ,navigate}));
  };

  async function addBrandHandler(e){
    if(brand.trim()=== ""){
      alert("Enter a value")
      return 
    }
    try{
      const label = brand 
      await dispatch(addBrandAsync({label,navigate}))
      setBrand("")
    }catch(err){
      console.log("Error : ",{err})
    }
  }

  async function addCategoryHandler(e){
    if(category.trim()=== ""){
      alert("Enter a value")
      return 
    }
    try{
      const label = category 
      await dispatch(addCategoryAsync({label,navigate}))
      setCategory("")
    }catch(err){
      console.log("Error : ",{err})
    }
  }

  return (
    <div className="wrapper sm:mx-16 my-5 bg-white box-border p-4">
      <header className="font-bold text-4xl">Create Product Form</header>

      {/* form */}

      <form className="mt-5" onSubmit={handleSubmit(formSubmitHandler)}>
        {/* Title */}
        <div className="title mb-8 w-[100%] flex flex-col gap-2">
          <div className="w-full flex flex-row items-center gap-2 ">
            <label className="font-medium text-sm">Title</label>
            <input
              type="text"
              {...register("title", { ...validations.title })}
              className={`focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none ${
                errors.title ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.title && (
            <span className="text-red-500 text-sm">*Title is required.</span>
          )}
        </div>

        {/* Price and discount*/}
        <div className="wrapper flex flex-col sm:flex-row sm:gap-10">
          <div className="price mb-8 max-w-[400px] flex flex-col  sm:justify-center gap-2">
            <div className="w-full flex flex-row">
              <label className="font-medium text-sm">Price ($)</label>
              <input
                type="decimal"
                {...register("price", { ...validations.price })}
                className={`focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none ${
                  errors.price ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.price && (
              <span className="text-red-500 text-sm">
                *{errors.price.message}
              </span>
            )}
          </div>

          {/* discountPercentage */}
          <div className="discountPercentage mb-8 max-w-[400px]  flex-col sm:justify-center gap-2">
            <div className="flex flex-row gap-2 items-center">
              <label className="font-medium text-sm">Discount Percentage</label>
              <input
                type="decimal"
                {...register("discountPercentage", {
                  ...validations.discountPercentage,
                })}
                className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
              />
            </div>
            {errors.discountPercentage && (
              <span className="text-red-500 text-sm">
                *{errors.discountPercentage.message}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="description mb-8 w-[100%] flex flex-col  gap-2">
          <div className="flex flex-row gap-2 items-center ">
            <label className="font-medium text-sm">Description</label>
            <input
              type="text"
              {...register("description", { ...validations.description })}
              className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
            />
          </div>
          {errors.description && (
            <span className="text-red-500 text-sm">
              *{errors.description.message}
            </span>
          )}
        </div>

        {/* brand and categories*/}
        <div className="wrapper flex flex-col md:flex-row md:gap-10">
          {/* brands */}
          <div className="brand mb-8 max-w-[400px] flex flex-col gap-2 ">
            <div className="flex flex-row items-center gap-2">
              <label className="font-medium text-sm">Brand</label>
              {brands && (
                <select
                  {...register("brand", { ...validations.brand })}
                  className={`hover:cursor-pointer focus:border-indigo-600 px-2 mt-2 h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none ${
                    errors.brand ? "border-red-500" : ""
                  }`}
                >
                  <option value="">--select brand--</option>
                  {brands.map(({ _id, label }) => (
                    <option key={_id} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {errors.brand && (
              <span className="text-red-500 text-sm">
                *{errors.brand.message}
              </span>
            )}
          </div>

          {/* categories */}
          <div className="categories mb-8 max-w-[400px] flex flex-col gap-2 ">
            <div className="flex flex-row items-center gap-2">
              <label className="font-medium text-sm">Categories</label>
              {categories && (
                <select
                  {...register("category", { ...validations.category })}
                  className={`hover:cursor-pointer focus:border-indigo-600 px-2 mt-2 h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none ${
                    errors.category ? "border-red-500" : ""
                  }`}
                >
                  <option value="">--select category--</option>
                  {categories.map(({ _id, label }) => (
                    <option key={_id} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {errors.category && (
              <span className="text-red-500 text-sm">
                *{errors.category.message}
              </span>
            )}
          </div>
        </div>

        {/* add brand and categories  */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-20">
        <div className="flex flex-row gap-3 items-center">
          <label className=" font-medium text-sm">Add Brand</label>
          <input 
            type = 'text'
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="focus:border-indigo-600 px-2 w-[150px] h-8 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none" /> 
          <button
            className="h-4 w-30 px-3 py-4 flex items-center justify-center rounded-md font-semibold text-md text-white bg-[#4338CA]"
            onClick={addBrandHandler}
            >ADD</button>
        </div>
        
        <div className="flex flex-row gap-3 items-center">
          <label className=" font-medium text-sm">Add Category</label>
          <input 
            type = 'text'
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            className="focus:border-indigo-600 px-2 w-[150px] h-8 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none" /> 
          <button
            className="h-4 w-30 px-3 py-4 flex items-center justify-center rounded-md font-semibold text-md text-white bg-[#4338CA]"
            onClick={addCategoryHandler}
            
            >ADD</button>
        </div>
        </div>

        {/* images */}
        <label className="font-medium text-sm">Images</label>
        <div className="brand mb-8 mt-2 flex-col gap-2 items-center">
          {new Array(4).fill(null).map((_, index) => (
            <>
              <div className="image mt-2 w-[90%]" key={index}>
                <label>image {index + 1}</label>
                <div className="hover:cursor-pointer flex items-center gap-2">
                  <input
                    type="text"
                    {...register(`images[${index}]`, {
                      required: `Image ${index + 1} is required`,
                    })}
                    className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
                  />
                  <FaCloudUploadAlt
                    className="h-8 w-8"
                    onClick={(e) => imageUploadClickHandler(e, index)}
                  />
                  {uploading.images[index] && <p>Uploading...</p>}
                </div>
              </div>
              <input
                type="file"
                key={index}
                ref={(el) => (imageUploadRefs.current[index] = el)}
                onChange={(e) => uploadImageOnCloudinaryHandler(e, index)}
                className="hidden"
              />

              {errors.images && errors.images[index] && (
                <span className="text-red-500 text-sm">
                  *{errors.images[index].message}
                </span>
              )}
            </>
          ))}
        </div>

        {/* thumbnail */}
        <label className="font-medium text-sm">Thumbnail</label>
        <div className="brand mb-8 mt-2 flex-col gap-2 items-center">
          <div className="image mt-2 w-[90%]">
            <div className="flex items-center gap-2 ">
              <input
                type="text"
                {...register("thumbnail", {
                  required: "Thumbnail is required",
                })}
                className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
              />
              <FaCloudUploadAlt
                className="h-8 w-8"
                onClick={thumbnailUploadClickHandler}
              />
              {uploading.thumbnail && <p>Uploading...</p>}
            </div>
          </div>
          <input
            type="file"
            ref={thumbnailRef}
            onChange={(e) => uploadThumbnailOnCloudinaryHandler(e)}
            className="hidden"
          />

          {errors.thumbnail && (
            <span className="text-red-500 text-sm">
              *{errors.thumbnail.message}
            </span>
          )}
        </div>

        {/* variations */}
        <div className=" variations-mobile mb-8 w-full  gap-2 items-center">
          <label className="font-medium text-sm mb-5">Variations :</label>
          <div className="web-view w-full flex flex-col gap-3">
            {watch("variations")?.map((variation, variationIndex) => {
              return (
                <div className="border-2 border-gray-400 p-2">
                  <div className="variation-wrapper flex items-center ">
                    <div className="font-semibold mr-3">Size</div>
                    <input
                      type="text"
                      {...register(`variations[${variationIndex}].size`, {
                        required: "Size is required",
                      })}
                      className="focus:border-indigo-600 w-[100px]  px-2 mt-2  h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
                    />
                    {errors?.variations?.[variationIndex]?.size && (
                      <span className="text-red-500 text-sm">
                        {errors.variations[variationIndex].size.message}
                      </span>
                    )}
                    <button
                      onClick={() => removeVariationHandler(variationIndex)}
                      className="px-2 py-1 m-2 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="font-semibold mr-3">Colors : </div>
                  <div className="hidden sm:flex sm:gap-16 ">
                    <div className="font-semibold text-sm">Color</div>
                    <div className="font-semibold text-sm">ColorCode</div>
                    <div className="font-semibold text-sm">Stock</div>
                  </div>
                  <div className="">
                    <div>
                      {variation.colors.map((color, colorFieldIndex) => {
                        return (
                          <>
                            <div className="flex flex-col sm:flex-row gap-2 ">
                              <div
                                key={colorFieldIndex}
                                className="flex gap-4 sm:flex-col items-center"
                              >
                                <span className="sm:hidden">Color</span>
                                <input
                                  {...register(
                                    `variations[${variationIndex}].colors[${colorFieldIndex}].color`,
                                    { required: "Color is required" }
                                  )}
                                  type="text"
                                  className={`focus:border-indigo-600 w-[100px] px-2 mt-2 h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none ${
                                    errors?.variations?.[variationIndex]
                                      ?.colors?.[colorFieldIndex]?.color
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                />
                                {errors?.variations?.[variationIndex]?.colors?.[
                                  colorFieldIndex
                                ]?.color && (
                                  <span className="text-red-500 text-sm">
                                    Color is required
                                  </span>
                                )}
                              </div>

                              <div className="flex gap-4 items-center sm:flex-col ">
                                <span className="sm:hidden">
                                  ColorCode (hex)
                                </span>
                                <input
                                  type="text"
                                  {...register(
                                    `variations[${variationIndex}].colors[${colorFieldIndex}].colorCode`,
                                    {
                                      required: "Required",
                                      pattern: {
                                        value: /^#[0-9A-F]{6}$/i,
                                        message:
                                          "Enter a valid hex color code (e.g., #RRGGBB)",
                                      },
                                      validate: {
                                        notEmpty: (value) => {
                                          if (!value.trim()) {
                                            return "colorCode is required";
                                          }
                                          return true; // Return true for valid inputs
                                        },
                                      },
                                    }
                                  )}
                                  className="focus:border-indigo-600 w-[100px]  px-2 mt-2  h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
                                />
                                {errors?.variations?.[variationIndex]?.colors?.[
                                  colorFieldIndex
                                ]?.colorCode && (
                                  <span className="text-red-500 text-sm">
                                    {
                                      errors.variations[variationIndex].colors[
                                        colorFieldIndex
                                      ].colorCode.message
                                    }
                                  </span>
                                )}
                              </div>

                              <div className="flex gap-4 items-center sm:flex-col">
                                <span className="sm:hidden">Stock</span>
                                <input
                                  type="number"
                                  {...register(
                                    `variations[${variationIndex}].colors[${colorFieldIndex}].stock`,
                                    { min: 0 }
                                  )}
                                  className={`focus:border-indigo-600 w-[100px] px-2 mt-2 h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none ${
                                    errors?.variations?.[variationIndex]
                                      ?.colors?.[colorFieldIndex]?.stock
                                      ? "border-red-500"
                                      : ""
                                  }`}
                                />
                                {errors?.variations?.[variationIndex]?.colors?.[
                                  colorFieldIndex
                                ]?.stock && (
                                  <span className="text-red-500 text-sm">
                                    Stock must be at least 0.
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() =>
                                  removeColorsField(
                                    variationIndex,
                                    colorFieldIndex
                                  )
                                }
                                className="px-2 py-1 w-[80px] m-2 bg-blue-500 text-white rounded"
                              >
                                Remove
                              </button>
                            </div>
                            <hr className="sm:hidden m-1" />
                          </>
                        );
                      })}
                      <button
                        onClick={() => addColorsField(variationIndex)}
                        className="px-2 py-1 m-2 bg-green-500 text-white rounded"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {errors.variations && (
              <span className="text-red-500 text-sm">
                *{errors.variations.message}
              </span>
            )}
          </div>

          <button
            onClick={addVariationHandler}
            type="button"
            className="px-2 py-1 m-2 bg-green-500 text-white rounded"
          >
            Add Variation
          </button>
        </div>

        {/* deleted */}
        <div className="detelted mb-8 max-w-[400px] flex gap-2 items-center">
          <label className="font-medium text-sm">Deleted</label>
          <select
            {...register("deleted")}
            className="hover:cursor-pointer focus:border-indigo-600 px-2 mt-2  h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="button-wrapper flex flex-row justify-end">
          <button
            className="h-5 w-20 px-3 py-4 flex items-center justify-center rounded-md font-semibold text-md"
            onClick={() => reset()}
          >
            Reset
          </button>
          <button
            type="submit"
            className="h-5 w-30 px-3 py-4 flex items-center justify-center rounded-md font-semibold text-md text-white bg-[#4338CA]"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
