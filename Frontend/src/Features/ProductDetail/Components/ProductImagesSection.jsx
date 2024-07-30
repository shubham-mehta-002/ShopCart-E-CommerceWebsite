import { useState } from "react";
import { v4 as uuid } from "uuid";

export function ProductImageSection({ images }) {
  // State to manage main image index
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Handle click on other images
  const handleImageClick = (imageIndex) => {
    setMainImageIndex(imageIndex);
  };

  return (
    <>
      <div className="images-container items-center justify-center w-full sm:w-[600px] md:w-[500px] xl:w-[50%] flex flex-col sm:flex-row sm:gap-2 mx-auto">
        {/* Main image */}
        <div className="main-image-container mx-auto my-3 px-3 sm:my-0 h-[300px] w-[75vw]  sm:h-[500px] sm:w-[500px] sm:block flex items justify-center box-border sm:p-10">
          <img
            className={`main-image h-full w-full rounded-sm`}
            src={images[mainImageIndex]}
          ></img>
        </div>

        {/* Other images */}
        <div className="xl:mt-4 other-images-wrapper mb-10 w-[90%] mx-auto sm:w-[200px] flex flex-row sm:flex-col justify-evenly items-center">
          {images
            .map((_, index) => index)
            .filter((index) => mainImageIndex !== index)
            .map((index) => (
              <img
                key={uuid()}
                onClick={() => handleImageClick(index)}
                src={images[index]}
                className={`h-[150px] w-[80%]  cursor-pointer rounded-md border-2 border-blue-200`}
                alt={`product-image-${index + 1}`}
              ></img>
            ))}
        </div>
      </div>
    </>
  );
}
