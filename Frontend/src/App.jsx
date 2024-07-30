import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import {
  RootPage,
  HomePage,
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
  AdminProductListPage,
  AdminEditProductPage,
  AdminOrdersPage,
  AdminEditOrderPage,
  AdminCreateProductPage,
  AdminRootPage,
} from "./Pages";

import { ProtectedRoute, AdminProtectedRoute, PublicRoute } from "./Features";
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
          element: <ProductListPage />,
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
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "wishlist",
          element: (
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "checkout",
          element: (
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "order-success/:orderId",
          element: (
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "myOrders",
          element: (
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
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
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
