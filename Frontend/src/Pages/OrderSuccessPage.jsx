import { useDispatch } from "react-redux"
import {useEffect} from "react"
import {Link, useParams} from "react-router-dom"
import {resetCurrentOrderStatus} from "../Features/Checkout/CheckoutSlice"

export const OrderSuccessPage = () =>{
    const {orderId} = useParams()
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(resetCurrentOrderStatus())
    },[])   

    return(
        <div className="wrapper h-[50vh] w-full bg-white flex flex-col gap-8 py-16 px-3 ">
            <div className="mx-auto text-[rgb(79,70,229)] hover:text-[#6366F1] font-semibold text-center">
                Order Successfully Placed
            </div>

            <div className="mx-auto text-xl md:text-4xl font-bold text-center">
                Order Number #{orderId}
            </div>

            <div className="mx-auto text-slate-800 text-center ">
                You can check order in Profile &gt; My Orders
            </div>

            
            <div className="mx-auto px-3 py-2 bg-[rgb(79,70,229)] text-[whitesmoke] font-semibold rounded-md text-center">
            <Link to="/home"><button> Go Back Home </button></Link>
            </div>
            
        </div>
    )
}