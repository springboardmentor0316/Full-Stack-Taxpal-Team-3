const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: [0.01, "Amount must be greater than 0"],
  },

  category: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },

  notes: {
    type: String,
    trim: true,
  },
});
//Performance indexes
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
