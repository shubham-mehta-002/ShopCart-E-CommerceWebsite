import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { MdRemoveRedEye } from "react-icons/md";

export function AdminOrderTile({ order }) {
  return (
    <>
    
      <hr className="mt-1 border-1 border-slate-400"/>
      <div className="order-wrapper flex flex-col md:flex-row gap-5 box-border mx-6 xl:mx-20 my-5 ">


        <div className="flex flex-row under items-center md:block orderId md:w-[10%] md:text-center break-words">
          <div className="md:hidden text-xl font-semibold ">Order ID : </div>
          <span className="font-bold ml-2 ">#{order._id}</span>
        </div>


        <ul className="items items-center gap-2 md:w-[30%]">
        <div className="md:hidden text-lg font-semibold  ">Items:  </div>
          {order.items.map((item) => (
            <div className="flex ml-5 mt-2 flex-row gap-2 mx-auto ">
              <div className="w-[40px]">
                
                <img
                  className="w-[30px] h-[30px] rounded-full "
                  src={item.product.thumbnail}
                />
              </div>
              <div>
                {item.product.title} (x{item.quantity}) - $
                {Math.floor(
                  ((100 - item.product.discountPercentage) / 100) *
                    item.product.price
                ) * item.quantity}
              </div>
            </div>
          ))}
          
        </ul>
        <div className="totalAmount  flex flex-row items-center md:justify-center md:w-[10%] ">
          <div className="md:hidden text-lg font-semibold">Total Amount :  </div>
          <span className="ml-3 ">${order.totalAmount}</span>
        </div>

        <div className="orderedAt  flex flex-row items-center md:justify-center md:w-[10%] ">
          <div className="md:hidden text-lg font-semibold">Ordered At :  </div>
          <span className="ml-3 ">{ new Date(order.createdAt).toLocaleString()}</span>
        </div>

        <div className="shipment-address md:w-[30%] md:text-center">
        <div className="md:hidden text-lg font-semibold ">Shipment Details :</div>
          <div>
            {order.billingName ? order.billingName : "USER"} <br />{" "}
            {order.address.street} <br /> {order.address.city},
            {order.address.state} <br />
            {order.address.pinCode} <br /> {order.phoneNumber}
          </div>
        </div>

        <div className="actions  my-2 md:w-[10%]">
          {/* <Link to={`edit/${order._id}`}><MdEdit className="h-7 w-7" /></Link>
          <Link to={`${order._id}`}><MdRemoveRedEye className="h-7 w-7"/></Link> */}
          <Link className="text-[rgb(79,70,229)] hover:text-[#6366F1]" to={`edit/${order._id}`}>click here</Link> to view/edit details 
        </div>
      </div>
    </>
  );
}
