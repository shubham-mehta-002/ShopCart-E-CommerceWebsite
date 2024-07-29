export function PriceDetail({discountPercentage,price,className}){
    return(
        <>
        <div className={`price whitespace-nowrap overflow-hidden text-ellipsis ${className}`}>
            <span className="text-xl font-bold">${Math.floor((100-discountPercentage)/100*price)}</span>
            <span className="text-lg font-semibold ml-2 text-[#949596]">$<strike>{price}</strike></span>
            <span className="text-lg font-semibold ml-1 text-[#5a65e4]">({discountPercentage}% OFF)</span>
            <div className="text-sm font-medium text-[#5a65e4]">Incusive of all taxes</div>
        </div>
        </>
    )
}