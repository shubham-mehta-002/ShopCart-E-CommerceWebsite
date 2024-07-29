import React, { useState } from "react";

export function SizeBadge({ size, quantity, index,setSelectedProductIndex,selectedProductIndex,setSelectedColorIndex,className }) {
  const defaultClasses = "h-10 w-10 px-10 py-3";
  const style = className?.trim() ? className : defaultClasses;

  // const diagonalLineStyle = {
  //   position: "absolute",
  //   top: "-50%",
  //   left: "0%",
  //   width: "100%",
  //   height: "100%",
  //   borderBottom: "2px solid red",
  // };

  const handleBadgeClick = () => {
     setSelectedProductIndex(index)
     if(index!==selectedProductIndex)
     setSelectedColorIndex(null)
  };

  return (
    <div
      className={`relative rounded-lg border-2 border-slate-300 flex items-center justify-center ${style} ${quantity ? "cursor-pointer" : "cursor-not-allowed"} ${
        selectedProductIndex===index ? "bg-blue-400" : "bg-white"
      } overflow-hidden rounded-lg border-2 border-slate-300 flex items-center justify-center relative ${style}`}
      onClick={handleBadgeClick}
    >
      {/* {quantity === 0 && (
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={diagonalLineStyle}
        ></div>
      )} */}
      <span className="font-semibold text-xl">{size}</span>
    </div>
  );
}
