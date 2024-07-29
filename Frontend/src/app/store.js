import { configureStore } from '@reduxjs/toolkit'
import ProductSlice from '../Features/Product/ProductSlice'
import ProductDetailSlice from '../Features/ProductDetail/ProductDetailSlice'
import AuthSlice from '../Features/Auth/AuthSlice'
import CartSlice from '../Features/Cart/CartSlice'
import orderSlice from "../Features/Checkout/CheckoutSlice"
import userSlice from "../Features/User/UserSlice"
import adminSlice from "../Features/Admin/AdminSlice"
import wishlistSlice from '../Features/Wishlist/WishlistSlice'


const store = configureStore({
  reducer: {
    product:ProductSlice,
    productDetail: ProductDetailSlice,
    auth:AuthSlice,
    cart:CartSlice,
    order:orderSlice,
    user:userSlice,
    admin:adminSlice,
    wishlist:wishlistSlice
  },
})

export { store }