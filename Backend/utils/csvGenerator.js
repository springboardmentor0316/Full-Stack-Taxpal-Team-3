const fs = require("fs");
const path = require("path");

exports.generateCSV = (reportType, reportData) => {
  const reportsDir = path.join(__dirname, "../reports");

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  const fileName = `${reportType.replace(/\s+/g, "_")}_${Date.now()}.csv`;
  const filePath = path.join(reportsDir, fileName);

  const rows = Object.entries(reportData);
  let csv = "Category,Amount\n";

  rows.forEach(([key, value]) => {
    csv += `${key},${value}\n`;
  });

  fs.writeFileSync(filePath, csv);
  return fileName;
};
