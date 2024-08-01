const express = require("express");

const router = express.Router();
router.use(express.json());
const { verifyJWT ,verifyAdminJWT} = require("../middleware/auth.middleware");

const {
  fetchUserDetails,
  createOrder,
  fetchUserOrders,
  fetchAllOrders,
  fetchOrderById,
  updateOrder,
} = require("../controllers/order.controller");



// TODO :  remove it
router.get("/", verifyJWT,fetchUserDetails);

router.post("/create",verifyJWT, createOrder);
router.get("/my", verifyJWT,fetchUserOrders);
router.get("/all", verifyAdminJWT,fetchAllOrders);
router.get("/:orderId", verifyJWT,fetchOrderById);
router.post("/update/:orderId",verifyAdminJWT, updateOrder);

module.exports = router;
