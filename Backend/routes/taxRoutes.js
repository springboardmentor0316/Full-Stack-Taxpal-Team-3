const express = require("express");
const router = express.Router();
const {
  calculateQuarterlyTax,
  getTaxEstimates,
} = require("../controllers/taxController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/calculate", authMiddleware, calculateQuarterlyTax);
router.get("/", authMiddleware, getTaxEstimates);

module.exports = router;
