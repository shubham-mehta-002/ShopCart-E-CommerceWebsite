import { ProductInfoSection } from "./ProductInfoSection";
import { ProductImageSection } from "./ProductImagesSection";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductDetailByIdAsync } from "../ProductDetailSlice";
import { selectProductById } from "../ProductDetailSlice";
import { Loader } from "../../../utils/Loader";

export function ProductDetail() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const selectedProduct = useSelector(selectProductById);

  useEffect(() => {
    dispatch(fetchProductDetailByIdAsync(productId));
  }, [dispatch]);

  return (
    <div className="wrapper flex flex-col gap-10">
      {selectedProduct.status === "loading" && <Loader/>}
      {selectedProduct.error && <p>{selectedProduct.error}</p>}

      {selectedProduct && selectedProduct.product && (
        <div>
          <div className="product-detail-wrapper md:flex flex-row gap-10">
            {/* Images section */}
            <ProductImageSection images={selectedProduct.product.images} />

            {/* Details container */}
            <ProductInfoSection {...selectedProduct.product} />
          </div>
          <div className="highlights px-5 w-[90vw] mx-auto mb-10">
            <span className="text-2xl font-bold">Higlights:</span>
            <ol className="list-disc mt-5">
              <li>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Voluptatem quos reprehenderit dignissimos fugit itaque culpa
                earum quas iure in quo, fuga, aliquid
              </li>
              <li>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Voluptatem quos reprehenderit dignissimos fugit itaque culpa
                earum quas iure in quo, fuga, aliquid
              </li>
              <li>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Voluptatem quos reprehenderit dignissimos fugit itaque culpa
                earum quas iure in quo, fuga, aliquid
              </li>
              <li>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Voluptatem quos reprehenderit dignissimos fugit itaque culpa
                earum quas iure in quo, fuga, aliquid
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
