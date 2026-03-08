exports.getDateRange = (period) => {
  const now = new Date();
  let startDate, endDate;

  switch (period) {
    case "Current Month":
    case "currentMonth":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = now;
      break;

    case "Last Month":
    case "lastMonth":
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      break;

    case "Last 3 Months":
    case "last3Months":
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      endDate = now;
      break;

    case "Current Year":
    case "currentYear":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = now;
      break;

    default:
      throw new Error(`Invalid period received: ${period}`);
  }

  return { startDate, endDate };
};
