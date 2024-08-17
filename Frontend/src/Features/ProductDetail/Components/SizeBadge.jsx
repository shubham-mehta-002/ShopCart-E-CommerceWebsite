import { useEffect } from "react";

export function SizeBadge({
  size,
  quantity,
  index,
  setSelectedProductIndex,
  selectedProductIndex,
  setSelectedColorIndex,
  className,
}) {
  const defaultClasses = "px-2 py-2 ";
  const style = className?.trim() ? className : defaultClasses;

  const handleBadgeClick = () => {
    setSelectedProductIndex(index);
    if (index !== selectedProductIndex) setSelectedColorIndex(null);
  };

  return (
    <div
      className={`relative rounded-lg border-2 border-slate-300 flex items-center justify-center ${style} ${
        quantity ? "cursor-pointer" : "cursor-not-allowed"
      } ${
        selectedProductIndex === index ? "bg-blue-400" : "bg-white"
      } overflow-hidden rounded-lg border-2 border-slate-300 flex items-center justify-center relative ${style}`}
      onClick={handleBadgeClick}
    >
      <span className="font-semibold text-sm">{size}</span>
    </div>
  );
}
