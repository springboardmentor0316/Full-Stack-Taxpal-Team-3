import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function SpendingChart({ expenses }) {

  //  ADD THIS CHECK (VERY IMPORTANT)
  if (!expenses || expenses.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Spending Breakdown</h3>
        <div
          className="pie-wrapper"
          style={{
            height: "280px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
          }}
        >
          No expense data available
        </div>
      </div>
    );
  }

  const categoryTotals = {};

  expenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
  });

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#ff7675",
          "#74b9ff",
          "#55efc4",
          "#ffeaa7",
          "#a29bfe",
          "#fab1a0",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Spending Breakdown</h3>
      <div className="pie-wrapper" style={{ height: "280px" }}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default SpendingChart;