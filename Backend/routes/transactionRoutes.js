
const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const {
  addIncome,
  addExpense,
  getIncome,
  getExpenses,
  getAllTransactions,
   updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

const router = express.Router();

// INCOME
router.post("/income", verifyToken, addIncome);
router.get("/income", verifyToken, getIncome);

// EXPENSE
router.post("/expense", verifyToken, addExpense);
router.get("/expense", verifyToken, getExpenses);
// ALL TRANSACTIONS (income + expense)
// ALL TRANSACTIONS
router.get("/", verifyToken, getAllTransactions);

// UPDATE
router.put("/:id", verifyToken, updateTransaction);

// DELETE
router.delete("/:id", verifyToken, deleteTransaction);



module.exports = router;
