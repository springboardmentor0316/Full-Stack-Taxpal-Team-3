const Transaction = require("../models/Transaction");

exports.addIncome = async (req, res) => {
  try {
    const { description, amount, category, date, notes } = req.body;

    const newIncome = await Transaction.create({
      userId: req.user.userId, 
      description,
      amount,
      category,
      date,
      notes,
      type: "income",
    });

    res.status(201).json(newIncome);
  } catch (error) {
    console.error("Add income error:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.getIncome = async (req, res) => {
  try {
    const incomeList = await Transaction.find({
      userId: req.user.userId,
      type: "income",
    }).sort({ date: -1 });

    res.json(incomeList);
  } catch (error) {
    console.error("Get income error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    console.log("Decoded user:", req.user); 
    
    //  ADD THIS LINE

    const { description, amount, category, date, notes } = req.body;

    const expense = await Transaction.create({
      userId: req.user.userId,  
      
      // correct
      description,
      amount,
      category,
      date,
      notes,
      type: "expense",
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Add expense error:", error);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Transaction.find({
     userId: req.user.userId,
      type: "expense",
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error("Get expenses error:", error);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.userId,
    }).sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};
// UPDATE transaction
exports.updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update transaction" });
  }
};

// DELETE transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const deleted = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};
