const Budget = require("../models/Budget");

exports.createBudget = async (req, res) => {
  try {
    const { category, amount, month, description } = req.body;

    const budget = await Budget.create({
      userId: req.user.userId,
      category,
      amount,
      month,
      description,
    });

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: "Failed to create budget" });
  }
};
exports.getBudgets = async (req, res) => {
  try {
    console.log("STEP 1 → req.user =", req.user); // 🔥 add this

    const budgets = await Budget.find({
      userId: req.user.userId,
    });

    res.status(200).json(budgets);
  } catch (err) {
    console.error("STEP 1 ERROR →", err); // 🔥 add this
    res.status(500).json({ message: err.message });
  }
};


exports.updateBudget = async (req, res) => {
  try {
    const updated = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update budget" });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete budget" });
  }
};
