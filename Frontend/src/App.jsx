import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import {
  RootPage,
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  ProductListPage,
  ProductDetailPage,
  CartPage,
  WishlistPage,
  CheckoutPage,
  OrderSuccessPage,
  LogoutPage,
  ResetPasswordPage,
  MyOrdersPage,
  MyProfilePage,
  AdminEditProductPage,
  AdminOrdersPage,
  AdminEditOrderPage,
  AdminCreateProductPage,
  AdminRootPage,
  PageNotFound
} from "./Pages";

import { ProtectedRoute, AdminProtectedRoute, PublicRoute  , UserProtectedRotues} from "./Features";
import { ToastContainer } from "react-toastify";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootPage />,
      children: [
        {
          path: "home",
          element: <Navigate to="/products" />,
        },
        {
          index: true,
          element: <Navigate to="/products" />,
        },
        {
          path: "products",
          element: <ProductListPage />,
        },
        {
          path: "products/:productId",
          element: <ProductDetailPage />,
        },
        {
          path: "cart",
          element: (
            <UserProtectedRotues>
              <CartPage />
            </UserProtectedRotues>
          ),
        },
        {
          path: "wishlist",
          element: (
            <UserProtectedRotues>
              <WishlistPage />
            </UserProtectedRotues>
          ),
        },
        {
          path: "checkout",
          element: (
            <UserProtectedRotues>
              <CheckoutPage />
            </UserProtectedRotues>
          ),
        },
        {
          path: "order-success/:orderId",
          element: (
            <UserProtectedRotues>
              <OrderSuccessPage />
            </UserProtectedRotues>
          ),
        },
        {
          path: "myOrders",
          element: (
            <UserProtectedRotues>
              <MyOrdersPage />
            </UserProtectedRotues>
          ),
        },
        {
          path: "myProfile",
          element: (
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin",
          element: <AdminRootPage />,
          children: [
            {
              index: true,
              element: (
                <AdminProtectedRoute>
                  <ProductListPage />
                </AdminProtectedRoute>
              ),
            },
            {
              path: "products",
              element: (
                <AdminProtectedRoute>
                  <ProductListPage />
                </AdminProtectedRoute>
              ),
            },
            {
              path: "product/:productId",
              element: (
                <AdminProtectedRoute>
                  <AdminEditProductPage />
                </AdminProtectedRoute>
              ),
            },
            {
              path: "orders/edit/:orderId",
              element: (
                <AdminProtectedRoute>
                  <AdminEditOrderPage />
                </AdminProtectedRoute>
              ),
            },
            {
              path: "orders",
              element: (
                <AdminProtectedRoute>
                  <AdminOrdersPage />
                </AdminProtectedRoute>
              ),
            },
            {
              path: "products/create",
              element: (
                <AdminProtectedRoute>
                  <AdminCreateProductPage />
                </AdminProtectedRoute>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: "/logout",
      element: <LogoutPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/reset-password",
      element: <ResetPasswordPage />,
    },
    {
      path: "*",
      element : <PageNotFound/>
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
