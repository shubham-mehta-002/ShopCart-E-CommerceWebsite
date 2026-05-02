# Frontend UI Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all silent API errors, double-submit vulnerabilities, alert() usages, and minor bugs across the React frontend.

**Architecture:** Each fix is isolated to its component — add error display via existing Redux error state, add `disabled` props to buttons tied to loading state, replace `alert()` with inline error `<p>` elements or react-toastify toasts (already installed).

**Tech Stack:** React 18, Redux Toolkit, React Hook Form, react-toastify, Tailwind CSS

---

## Files Modified

| File | Changes |
|------|---------|
| `src/Features/Auth/Components/LoginForm.jsx` | Show Redux error, keep button disabled during loading |
| `src/Features/Auth/Components/SignupForm.jsx` | Show Redux error, strengthen disabled, reset form on success |
| `src/Features/Auth/Components/ForgotPasswordForm.jsx` | Disable button during send, show error on failure |
| `src/Features/Auth/Components/ResetPassword.jsx` | Show error on failure |
| `src/Features/Cart/Cart.jsx` | Show fetch error |
| `src/Features/Wishlist/Wishlist.jsx` | Show fetch/remove errors, disable remove button |
| `src/Features/Checkout/Components/CartSummary.jsx` | Replace alert(), show order error, verify button disabled |
| `src/Features/Checkout/Components/Checkout.jsx` | Disable add-address button, reset form on success |
| `src/Features/ProductDetail/Components/ProductInfoSection.jsx` | Replace alert() with inline errors, disable buttons during loading |
| `src/Features/Admin/Product/AdminCreateProductForm.jsx` | Disable save, show errors, replace alert() |
| `src/Features/Admin/Product/AdminEditProductForm.jsx` | Disable save, show errors, replace alert() |
| `src/Features/Admin/Order/AdminEditOrderForm.jsx` | Disable save, show error, remove undefined `setSelectedColorIndex` call |
| `src/Features/User/Components/MyProfile.jsx` | Fix `filedValue.number` typo → `filedValue.name`, disable save buttons, show errors |

---

## Task 1: Auth — LoginForm

**Files:** `src/Features/Auth/Components/LoginForm.jsx`

- [ ] **Step 1: Read the file and locate error/loading state selectors**

  Open `LoginForm.jsx`. Find what slice selectors are imported from `AuthSlice`. Confirm `loginState.error` and `loginState.status` exist.

- [ ] **Step 2: Display API error below the submit button**

  After the submit button, add:
  ```jsx
  {loginState.error && (
    <p className="text-red-500 text-sm text-center mt-2">{loginState.error}</p>
  )}
  ```

- [ ] **Step 3: Ensure submit button is disabled during loading**

  Find the submit button. Change `disabled` to:
  ```jsx
  disabled={loginState.status === "loading"}
  ```

- [ ] **Step 4: Commit**
  ```
  git add src/Features/Auth/Components/LoginForm.jsx
  git commit -m "fix: show login API error and block double-submit"
  ```

---

## Task 2: Auth — SignupForm

**Files:** `src/Features/Auth/Components/SignupForm.jsx`

- [ ] **Step 1: Locate error state and submit button**

  Find `signUpState.error` selector and the submit button near the bottom of JSX.

- [ ] **Step 2: Display signup error**

  Add below submit button:
  ```jsx
  {signUpState.error && (
    <p className="text-red-500 text-sm text-center mt-2">{signUpState.error}</p>
  )}
  ```

- [ ] **Step 3: Strengthen disabled prop**

  Change submit button disabled to:
  ```jsx
  disabled={isSubmitting || signUpState.status === "loading"}
  ```

- [ ] **Step 4: Reset form on successful registration**

  In the success branch (where navigate is called), add `reset()` before `navigate(...)`:
  ```js
  reset();
  navigate("/login");
  ```

- [ ] **Step 5: Commit**
  ```
  git add src/Features/Auth/Components/SignupForm.jsx
  git commit -m "fix: show signup error, block double-submit, reset form on success"
  ```

---

## Task 3: Auth — ForgotPasswordForm

**Files:** `src/Features/Auth/Components/ForgotPasswordForm.jsx`

- [ ] **Step 1: Read file — locate mailSentStatus and the send button**

  Find `mailSentStatus` from the selector. Identify the "Send Mail" button.

- [ ] **Step 2: Disable button during loading**

  Change the send button to:
  ```jsx
  <button
    type="submit"
    disabled={mailSentStatus === "loading" || mailSentStatus === "success"}
    className="... disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {mailSentStatus === "loading" ? "Sending..." : "Send Mail"}
  </button>
  ```

- [ ] **Step 3: Show error if send fails**

  Below the button add:
  ```jsx
  {mailSentStatus === "error" && (
    <p className="text-red-500 text-sm text-center mt-2">Failed to send email. Try again.</p>
  )}
  ```

- [ ] **Step 4: Commit**
  ```
  git add src/Features/Auth/Components/ForgotPasswordForm.jsx
  git commit -m "fix: disable send-mail button during request, show error on failure"
  ```

---

## Task 4: Auth — ResetPassword

**Files:** `src/Features/Auth/Components/ResetPassword.jsx`

- [ ] **Step 1: Read file — find resetPasswordStatus selector and submit button**

- [ ] **Step 2: Show error if reset fails**

  Below the submit button add:
  ```jsx
  {resetPasswordStatus === "error" && (
    <p className="text-red-500 text-sm text-center mt-2">Failed to reset password. Link may have expired.</p>
  )}
  ```

- [ ] **Step 3: Disable button during loading**

  Add to submit button:
  ```jsx
  disabled={resetPasswordStatus === "loading"}
  ```

- [ ] **Step 4: Commit**
  ```
  git add src/Features/Auth/Components/ResetPassword.jsx
  git commit -m "fix: show reset password error and block double-submit"
  ```

---

## Task 5: Cart — Show Fetch Error

**Files:** `src/Features/Cart/Cart.jsx`

- [ ] **Step 1: Read file — find cart state/error selector**

  Look for `state.error` or `cartError` from the cart slice selector.

- [ ] **Step 2: Display error when cart fetch fails**

  Find where the cart items are rendered. Above the items list, add:
  ```jsx
  {state.error && (
    <p className="text-red-500 text-center text-sm my-4">{state.error}</p>
  )}
  ```

- [ ] **Step 3: Commit**
  ```
  git add src/Features/Cart/Cart.jsx
  git commit -m "fix: show cart fetch error in UI"
  ```

---

## Task 6: Wishlist — Errors + Disable Remove Button

**Files:** `src/Features/Wishlist/Wishlist.jsx`

- [ ] **Step 1: Read file — find status/error selectors and remove button**

- [ ] **Step 2: Show fetch error**

  Near the top of the render (before mapping items), add:
  ```jsx
  {wishlistError && (
    <p className="text-red-500 text-center text-sm my-4">{wishlistError}</p>
  )}
  ```

- [ ] **Step 3: Disable remove button during loading**

  Find the Remove button. Add:
  ```jsx
  disabled={wishlistStatus === "loading"}
  className="... disabled:opacity-50 disabled:cursor-not-allowed"
  ```

- [ ] **Step 4: Commit**
  ```
  git add src/Features/Wishlist/Wishlist.jsx
  git commit -m "fix: show wishlist errors, disable remove during loading"
  ```

---

## Task 7: Checkout — CartSummary (Replace alert, Show Error)

**Files:** `src/Features/Checkout/Components/CartSummary.jsx`

- [ ] **Step 1: Read file — find alert() calls and orderStatus**

  Locate all `alert(...)` calls. Find `orderStatus` from slice.

- [ ] **Step 2: Add local error state**

  At top of component add:
  ```jsx
  const [validationError, setValidationError] = useState("");
  ```

- [ ] **Step 3: Replace every alert() with setValidationError()**

  For each `alert("some message")` replace with:
  ```js
  setValidationError("some message");
  return;
  ```

- [ ] **Step 4: Display validation error and API error in JSX**

  Below the Order button add:
  ```jsx
  {validationError && (
    <p className="text-red-500 text-sm mt-2">{validationError}</p>
  )}
  {orderError && (
    <p className="text-red-500 text-sm mt-2">{orderError}</p>
  )}
  ```

- [ ] **Step 5: Clear validationError when user corrects input**

  At the start of the order handler, add `setValidationError("")`.

- [ ] **Step 6: Commit**
  ```
  git add src/Features/Checkout/Components/CartSummary.jsx
  git commit -m "fix: replace alert() with inline errors in CartSummary, show order API error"
  ```

---

## Task 8: Checkout — Add-Address Button + Form Reset

**Files:** `src/Features/Checkout/Components/Checkout.jsx`

- [ ] **Step 1: Read file — find add-address button and state.status**

- [ ] **Step 2: Disable add-address button during loading**

  Find the "Add Address" / "Save" button in the address form. Add:
  ```jsx
  disabled={state.status === "loading"}
  className="... disabled:opacity-60 disabled:cursor-not-allowed"
  ```

- [ ] **Step 3: Reset address form after successful add**

  In the `then` / success branch of the `addUserAddressAsync` dispatch, call `reset()` (from react-hook-form):
  ```js
  dispatch(addUserAddressAsync(addressData)).then((res) => {
    if (res?.payload?.data?.statusCode === 200) {
      reset();
    }
  });
  ```

- [ ] **Step 4: Commit**
  ```
  git add src/Features/Checkout/Components/Checkout.jsx
  git commit -m "fix: disable address form during submit, reset form on success"
  ```

---

## Task 9: ProductDetail — Replace alert(), Disable Buttons

**Files:** `src/Features/ProductDetail/Components/ProductInfoSection.jsx`

- [ ] **Step 1: Read file — find all alert() calls and addToCartStatus**

- [ ] **Step 2: Add local state for validation errors**

  ```jsx
  const [selectionError, setSelectionError] = useState("");
  ```

- [ ] **Step 3: Replace all alert() with setSelectionError()**

  For each `alert("Please select a size")` / `alert("Please select a color")` replace with:
  ```js
  setSelectionError("Please select a size and color before adding to cart.");
  return;
  ```
  Clear it when selection changes: call `setSelectionError("")` in color/size click handlers.

- [ ] **Step 4: Render selection error in JSX**

  Above the Add to Cart button:
  ```jsx
  {selectionError && (
    <p className="text-red-500 text-sm mb-2">{selectionError}</p>
  )}
  ```

- [ ] **Step 5: Disable Add to Cart button during loading**

  ```jsx
  <AddToCartButton
    disabled={addToCartStatus === "loading"}
    ...
  />
  ```

  In `AddToCartButton.jsx`, accept and apply the `disabled` prop:
  ```jsx
  export function AddToCartButton({ message, onClick, disabled }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="... disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {message}
      </button>
    );
  }
  ```

- [ ] **Step 6: Commit**
  ```
  git add src/Features/ProductDetail/Components/ProductInfoSection.jsx
  git add src/Features/Common/Buttons/AddToCartButton.jsx
  git commit -m "fix: replace alert() with inline errors in ProductDetail, disable button during cart add"
  ```

---

## Task 10: Admin — Create Product Form

**Files:** `src/Features/Admin/Product/AdminCreateProductForm.jsx`

- [ ] **Step 1: Read file — find all alert() calls, Save button, and status from slice**

- [ ] **Step 2: Replace alert() calls with toast**

  Import toast if not already: `import { toast } from "react-toastify";`

  Replace each `alert("message")` with:
  ```js
  toast.error("message");
  return;
  ```

- [ ] **Step 3: Disable Save button during loading**

  Find the Save/Submit button. Add:
  ```jsx
  disabled={status === "loading"}
  className="... disabled:opacity-60 disabled:cursor-not-allowed"
  ```

- [ ] **Step 4: Show API error via toast if product create fails**

  In the dispatch `.then()` handler check for error payload and call `toast.error(errorMessage)`.

- [ ] **Step 5: Commit**
  ```
  git add src/Features/Admin/Product/AdminCreateProductForm.jsx
  git commit -m "fix: replace alerts with toasts in AdminCreateProduct, disable save during loading"
  ```

---

## Task 11: Admin — Edit Product Form

**Files:** `src/Features/Admin/Product/AdminEditProductForm.jsx`

- [ ] **Step 1: Read file — find alert() calls and Save button**

- [ ] **Step 2: Replace alert() with toast.error()**

  Same pattern as Task 10:
  ```js
  import { toast } from "react-toastify";
  // replace each alert(...) with toast.error(...)
  ```

- [ ] **Step 3: Disable Save button during loading**

  ```jsx
  disabled={updateStatus === "loading"}
  className="... disabled:opacity-60 disabled:cursor-not-allowed"
  ```

- [ ] **Step 4: Commit**
  ```
  git add src/Features/Admin/Product/AdminEditProductForm.jsx
  git commit -m "fix: replace alerts with toasts in AdminEditProduct, disable save during loading"
  ```

---

## Task 12: Admin — Edit Order Form

**Files:** `src/Features/Admin/Order/AdminEditOrderForm.jsx`

- [ ] **Step 1: Read file — find `setSelectedColorIndex` call and Save button**

- [ ] **Step 2: Remove the undefined `setSelectedColorIndex` call**

  Find the line calling `setSelectedColorIndex(...)`. Delete it — this function is never defined in this component.

- [ ] **Step 3: Disable Save button during loading**

  Find the Save button. Add:
  ```jsx
  disabled={orderUpdateStatus === "loading"}
  className="... disabled:opacity-60 disabled:cursor-not-allowed"
  ```

- [ ] **Step 4: Show error if order update fails**

  After the Save button:
  ```jsx
  {orderUpdateError && (
    <p className="text-red-500 text-sm mt-2">{orderUpdateError}</p>
  )}
  ```

- [ ] **Step 5: Commit**
  ```
  git add src/Features/Admin/Order/AdminEditOrderForm.jsx
  git commit -m "fix: remove undefined function call, disable save, show error in AdminEditOrder"
  ```

---

## Task 13: User Profile — Typo Fix + Button Disable + Errors

**Files:** `src/Features/User/Components/MyProfile.jsx`

- [ ] **Step 1: Read file — find `filedValue.number` typo (~line 223) and save buttons**

- [ ] **Step 2: Fix the typo**

  Change:
  ```jsx
  value={filedValue.number}
  ```
  To:
  ```jsx
  value={filedValue.name}
  ```

- [ ] **Step 3: Disable all save buttons during loading**

  For each save button (name, phone, address), add:
  ```jsx
  disabled={status === "loading"}
  className="... disabled:opacity-60 disabled:cursor-not-allowed"
  ```

- [ ] **Step 4: Show profile update errors**

  After each save button group, add:
  ```jsx
  {error && (
    <p className="text-red-500 text-sm mt-1">{error}</p>
  )}
  ```

- [ ] **Step 5: Commit**
  ```
  git add src/Features/User/Components/MyProfile.jsx
  git commit -m "fix: typo filedValue.number->name, disable save buttons, show profile errors"
  ```

---

## Summary

| # | Task | Files | Key Fix |
|---|------|-------|---------|
| 1 | LoginForm | 1 | Show error, disable button |
| 2 | SignupForm | 1 | Show error, strengthen disable, reset on success |
| 3 | ForgotPasswordForm | 1 | Disable send, show error |
| 4 | ResetPassword | 1 | Show error, disable button |
| 5 | Cart | 1 | Show fetch error |
| 6 | Wishlist | 1 | Show errors, disable remove |
| 7 | CartSummary | 1 | Replace alert(), show order error |
| 8 | Checkout | 1 | Disable add-address, reset form |
| 9 | ProductDetail + AddToCartButton | 2 | Replace alert(), disable button |
| 10 | AdminCreateProduct | 1 | Replace alert(), disable save |
| 11 | AdminEditProduct | 1 | Replace alert(), disable save |
| 12 | AdminEditOrder | 1 | Remove undefined call, disable save |
| 13 | MyProfile | 1 | Fix typo, disable buttons, show errors |

**13 tasks · 15 files · ~52 issues fixed**
