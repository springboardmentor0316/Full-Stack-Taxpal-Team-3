const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const {
  createBudget,
  getBudgets,
  deleteBudget,
  updateBudget,
} = require("../controllers/budgetController");

const router = express.Router();

router.post("/", verifyToken, createBudget);
router.get("/", verifyToken, getBudgets);
router.put("/:id", verifyToken, updateBudget);
router.delete("/:id", verifyToken, deleteBudget);

module.exports = router;
