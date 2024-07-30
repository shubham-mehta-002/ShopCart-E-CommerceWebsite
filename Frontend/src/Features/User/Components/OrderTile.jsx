import { Link } from "react-router-dom";

export function OrderTile({ order }) {
  return (
    <>
      <div className="order-item-wrapper flex flex-col gap-5 box-border sm:mx-6 xl:mx-20 my-5 ">
        {order.items.map((item) => {
          return (
            <div className="bg-white p-4 flex flex-col gap-4">
              <div className="order-id text-center text-xl sm:text-2xl font-bold text-[#5557d4] ">
                Order #{order._id}
              </div>
              <div className="order-status font-semibold">
                Order Status : <span className="uppercase">{item.status}</span>
              </div>
              <div className="product flex flex-row gap-5">
                <div className="thumbnail">
                  <Link to={`/products/${item.product._id}`}>
                    <img src={item.product.thumbnail} className="h-20 w-20" />
                  </Link>
                </div>
                <div className="description w-full flex flex-col">
                  <div className="text-lg font-semibold">
                    {item.product.title}
                  </div>
                  <div className="flex w-full flex-row justify-between">
                    <div>{item.product.title}</div>
                    <div className="font-bold text-base">
                      $
                      {Math.floor(
                        ((100 - item.product.discountPercentage) / 100) *
                          item.product.price
                      )}
                    </div>
                  </div>
                  <div className="size-color flex flex-row gap-5">
                    <div className="font-semibold">Size: {item.size}</div>
                    <div className="font-semibold">Color: {item.color}</div>
                  </div>
                  <div className="quantity">
                    <span className="font-semibold ">Qty : </span>
                    {item.quantity}
                  </div>
                </div>
              </div>
              <hr />
              <div className="total flex flex-row justify-between">
                <div className="font-semibold">Subtotal</div>
                <div className="font-bold text-base">
                  $
                  {Math.floor(
                    ((100 - item.product.discountPercentage) / 100) *
                      item.product.price
                  ) * item.quantity}
                </div>
              </div>
              <div className="paymnet-mode">
                <span className="font-semibold">Payment Method : </span>
                <span className="uppercase">{order.paymentMethod}</span>
              </div>

              <div className="shipping details ">
                <span className="font-semibold ">Shipping details : </span>
                <div className="p-1 mt-1 border-2 flex flex-col sm:flex-row sm:items-center sm:justify-center">
                  <div className="address sm:w-[70%]">
                    <div>{order.billingName}</div>
                    <div>{order.address.street}</div>
                    <div>
                      {order.address.city},{order.address.pincode}
                    </div>
                    <div className="font-medium">
                      Pincode : {order.address.pinCode}
                    </div>
                  </div>
                  <div className="contact sm:w-[30%]">
                    <div className="phone">Phone : {order.phoneNumber}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
