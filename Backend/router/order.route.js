const express = require("express");

const router = express.Router();
router.use(express.json());
const { verifyJWT } = require("../middleware/auth.middleware");

const {
  fetchUserDetails,
  createOrder,
  fetchUserOrders,
  fetchAllOrders,
  fetchOrderById,
  updateOrder,
} = require("../controllers/order.controller");

router.use(verifyJWT);

// TODO :  remove it
router.get("/", fetchUserDetails);

router.post("/create", createOrder);
router.get("/my", fetchUserOrders);
router.get("/all", fetchAllOrders);
router.get("/:orderId", fetchOrderById);
router.post("/update/:orderId", updateOrder);

module.exports = router;
