import { CiHeart } from "react-icons/ci";
import {useSelector , useDispatch} from "react-redux"
import {useState} from "react"
import { updateProductAsync } from "../../ProductDetail/ProductDetailSlice";

export function AdminProductCard({_id,className,thumbnail,title,brand,discountPercentage,price,deleted}){
    const dispatch = useDispatch()
    // const [ isProductDeleted ,  setIsProductDeleted] = useState(deleted)
    const editProductHandler = (e) =>{
        e.preventDefault()
        console.log("editing")
    }

    const ProductStatusHandler = (e) =>{
        e.preventDefault()
        // setIsProductDeleted(prevVal => !prevVal)
        const fieldsToBeUpdated = {
            deleted : !deleted
        }
        dispatch(updateProductAsync({_id, fieldsToBeUpdated}))
        console.log("deleting ....")
    }

    return(
        
        <div className={`text-black p-2 border-2 border-[#E5E7EB] border-solid box-border ${className} flex flex-col justify-between h-full `}>
            <div className="content-wrapper flex flex-col h-[85%] justify-between">
                <div className="image-wrapper h-[70%]">
                    <img src={thumbnail} alt={title} className="h-full w-full rounded-md bg-[#ccced2] hover:bg-[#CDD1D7]"/>  
                </div>

                <div className="product-details h-[18%] flex flex-row">
                    <div className="details w-[85%]">
                        <div className="brand text-md font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{brand}</div>
                        <div className="title text-sm whitespace-nowrap overflow-hidden text-ellipsis">{title}</div>
                    </div>

                    <div className="price w-[15%] flex items-center justify-center">
                        <CiHeart className="h-9 w-9"/>
                    </div>
                </div>

                <div className="price h-[7%] whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="text-sm font-bold">${Math.floor((100-discountPercentage)/100*price)}</span>
                    <span className="text-sm font-semibold ml-2 text-[#949596]">$<strike>{price}</strike></span>
                    <span className="text-sm font-semibold ml-1 text-[#5a65e4]">({discountPercentage}% OFF)</span>
                </div>

                
            </div>

            <div className="button-wrapper h-[15%] flex flex-col sm:flex-row justify-between mt-2">
                <button className="hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold px-4 py-1"
                onClick={(e)=>editProductHandler(e)}
                >
                    Edit
                </button>

                <button className="hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold px-4 py-1"
                onClick={(e)=>ProductStatusHandler(e)}
                >
                    {deleted ? "Add" : "Delete"}
                </button>
            </div>
            {<div className="h-[5%] text-sm font-semibold text-red-600">{deleted ? "deleted" : ""}</div>}
            

        </div>
        
    )
}
