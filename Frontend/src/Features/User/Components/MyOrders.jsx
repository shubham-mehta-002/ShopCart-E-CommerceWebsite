import { useSelector, useDispatch } from "react-redux";
import { fetchUserOrdersAsync, selectUserOrderDetails, selectUserState } from "../UserSlice";
import { useEffect } from "react";
import {Link} from "react-router-dom"
import { OrderTile } from "./OrderTile";

export function MyOrders() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserOrdersAsync());
  }, [dispatch]);

  const orders = useSelector(selectUserOrderDetails);
  const { status } = useSelector(selectUserState);

  useEffect(() => {
    console.log({ orders }); // Log orders to check the data structure
  }, [orders]);

  return (
    <>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <div className="order-wrapper flex flex-col gap-5">
          {orders && orders.length === 0 ? (
            <>
            <div className="h-[60vh] bg-white flex items-center justify-center flex-col gap-5  text-center ">
            <div className="text-3xl font-semibold "> Seems like you didn't order anything yet !! </div> 
            <div className="text-lg"><Link to="/products" className="text-[rgb(79,70,229)] font-semibold  hover:text-[#6366F1] hover:cursor-pointer">Click here</Link> to order something</div>
             </div>
            </>
          ) : (
            <div className="order-wrapper sm:ml-10 mt-8">
            <div className="header text-5xl mb-8  font-bold">My Orders</div>
            <hr className="border-1 w-[90%] border-gray-400 "/>
            {orders && orders.map((order) => (
              <OrderTile order={order} />
            ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}


