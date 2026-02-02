const mongoose = require("mongoose");

const taxEstimateSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quarter: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4"],
      required: true,
    },
    estimated_tax: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaxEstimate", taxEstimateSchema);
