exports.expenseSummary = (transactions) => {
  const summary = {};

  transactions.forEach(txn => {
    if (txn.type === "expense") {
      if (!summary[txn.category]) {
        summary[txn.category] = 0;
      }
      summary[txn.category] += txn.amount;
    }
  });

  return summary;
};
// Expense summary by category
exports.expenseSummary = (transactions) => {
  const summary = {};

  transactions.forEach(txn => {
    if (txn.type === "expense") {
      if (!summary[txn.category]) {
        summary[txn.category] = 0;
      }
      summary[txn.category] += txn.amount;
    }
  });

  return summary;
};

// Income summary by category
exports.incomeSummary = (transactions) => {
  const summary = {};

  transactions.forEach(txn => {
    if (txn.type === "income") {
      if (!summary[txn.category]) {
        summary[txn.category] = 0;
      }
      summary[txn.category] += txn.amount;
    }
  });

  return summary;
};

// Overall totals
exports.overallTotals = (transactions) => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(txn => {
    if (txn.type === "income") {
      totalIncome += txn.amount;
    } else if (txn.type === "expense") {
      totalExpense += txn.amount;
    }
  });

  return {
    totalIncome,
    totalExpense,
    netSavings: totalIncome - totalExpense
  };
};
