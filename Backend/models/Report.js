const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: false
},

    reportType: {
      type: String,
      required: true
    },
    period: {
      type: String,
      required: true
    },
    format: {
      type: String,
      enum: ["PDF", "CSV"],
      required: true
    },
    fileName: {
  type: String,
    }
},
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
