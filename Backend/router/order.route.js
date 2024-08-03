const express = require("express");

const router = express.Router();
router.use(express.json());
const { verifyJWT ,verifyAdminJWT} = require("../middleware/auth.middleware");

const {
  createOrder,
  fetchUserOrders,
  fetchAllOrders,
  fetchOrderById,
  updateOrder,
} = require("../controllers/order.controller");



router.post("/create",verifyJWT, createOrder);
router.get("/", verifyJWT,fetchUserOrders);
router.get("/all", verifyAdminJWT,fetchAllOrders);
router.get("/:orderId", verifyJWT,fetchOrderById);
router.post("/update/:orderId",verifyAdminJWT, updateOrder);

module.exports = router;
