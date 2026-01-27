const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const {
  addIncome,
  addExpense,
  getIncome,
  getExpenses,
} = require("../controllers/transactionController");

const router = express.Router();

// INCOME
router.post("/income", verifyToken, addIncome);
router.get("/income", verifyToken, getIncome);

// EXPENSE
router.post("/expense", verifyToken, addExpense);
router.get("/expense", verifyToken, getExpenses);

module.exports = router;
