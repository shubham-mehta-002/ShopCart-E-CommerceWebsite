import { useSelector, useDispatch } from "react-redux";
import { fetchUserOrdersAsync, selectUserOrderDetails, selectUserState } from "../UserSlice";
import { useEffect } from "react";
import {Link} from "react-router-dom"
import { OrderTile } from "./OrderTile";
import { Loader } from "../../../utils/Loader";
import { useNavigate } from "react-router-dom";
import {v4 as uuid} from "uuid"

export function MyOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchUserOrdersAsync({navigate}));
  }, [dispatch]);

  const orders = useSelector(selectUserOrderDetails);
  const { status } = useSelector(selectUserState);

  return (
    <>
      {status === "loading" ? (
        <Loader/>
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
              <OrderTile key={uuid()} order={order} />
            ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}


