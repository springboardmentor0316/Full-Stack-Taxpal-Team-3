const Transaction = require("../models/Transaction");
const { getDateRange } = require("../utils/reportPeriods");
const Report = require("../models/Report");
const { generatePDF } = require("../utils/pdfGenerator");
const { generateCSV } = require("../utils/csvGenerator");

const {
  expenseSummary,
  incomeSummary,
  overallTotals
} = require("../utils/reportAggregations");

exports.generateReport = async (req, res) => {
  try {
    const { reportType, period, format } = req.body;

    if (!reportType || !period || !format) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { startDate, endDate } = getDateRange(period);

    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate }
    });

    let reportData;

    switch (reportType) {
      case "Expense Summary":
        reportData = expenseSummary(transactions);
        break;

      case "Income Summary":
        reportData = incomeSummary(transactions);
        break;

      case "Overall Summary":
        reportData = overallTotals(transactions);
        break;

      default:
        reportData = transactions;
    }

  let fileName;

if (format === "PDF") {
  fileName = await generatePDF(reportType, reportData);
} else if (format === "CSV") {
  fileName = generateCSV(reportType, reportData);
}

// Save report metadata
const report = await Report.create({
  userId: req.user?.id || null,
  reportType,
  period,
  format,
  fileName
});

res.status(200).json({
  message: "Report generated successfully",
  reportId: report._id,
  downloadUrl: `/reports/${fileName}`,
  reportData
});

  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.getRecentReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
