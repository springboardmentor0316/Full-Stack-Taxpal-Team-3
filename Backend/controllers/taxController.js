const Transaction = require("../models/Transaction");
const calculateTax = require('../utils/calculateTax');
const TaxEstimate = require('../models/TaxEstimate');

const quarterlyDueDates = require("../utils/quarterlyDueDates");


// Calculate quarterly tax
exports.calculateQuarterlyTax = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quarter, country } = req.body;
    const dueDate = quarterlyDueDates[country][quarter];


    const quarterMonths = {
      Q1: [0, 1, 2],
      Q2: [3, 4, 5],
      Q3: [6, 7, 8],
      Q4: [9, 10, 11],
    };

    const months = quarterMonths[quarter];
    if (!months) {
      return res.status(400).json({ message: "Invalid quarter" });
    }

    const transactions = await Transaction.find({
      user_id: userId,
      type: "income",
      $expr: {
        $in: [{ $month: "$date" }, months.map((m) => m + 1)],
      },
    });

    const totalIncome = transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    const tax = calculateTax(totalIncome, country);

    const taxEstimate = await TaxEstimate.create({
      user_id: userId,
      quarter,
      estimated_tax: tax,
      country,
    });

    res.status(201).json({
      quarter,
      totalIncome,
      estimatedTax: tax,
      taxEstimate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tax estimates (for calendar / UI)
exports.getTaxEstimates = async (req, res) => {
  try {
    const taxes = await TaxEstimate.find({ user_id: req.user.id });
    res.json(taxes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
