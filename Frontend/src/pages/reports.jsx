import { useEffect, useMemo, useState } from "react";
import { FaDownload, FaEye, FaPrint, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "../styles/reports.css";

function formatDateTime(isoString) {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(date);
  } catch {
    return "";
  }
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
const REPORT_TYPE_MAP = {
  "Income Statement": "Income Summary",
  "Expense Summary": "Expense Summary",
  "Cash Flow": "Overall Summary",
  "Transaction Report": "Transaction Report",
};

const PERIOD_MAP = {
  "Current Month": "currentMonth",
  "Last Month": "lastMonth",
  "Last 3 Months": "last3Months",
  "Current Year": "currentYear",
};


function Reports() {
  const [reportType, setReportType] = useState("Income Statement");
  const [period, setPeriod] = useState("Current Month");
  const [format, setFormat] = useState("PDF");

  const [recentReports, setRecentReports] = useState([]);
  const [activeReportId, setActiveReportId] = useState(null);

  const activeReport = useMemo(
    () => recentReports.find((r) => r.id === activeReportId) || null,
    [recentReports, activeReportId]
  );

  const handleReset = () => {
    setReportType("Income Statement");
    setPeriod("Current Month");
    setFormat("PDF");
  };
  const fetchRecentReports = async () => {
  try {
    const res = await fetch("http://localhost:4000/api/reports/recent");
    const data = await res.json();

    const formatted = data.map((r) => ({
      id: r._id,
      name: `${r.reportType} (${r.period})`,
      reportType: r.reportType,
      period: r.period,
      format: r.format,
      generatedAt: r.createdAt,
      downloadUrl: r.fileName ? `/reports/${r.fileName}` : null,
    }));

    setRecentReports(formatted);
    if (formatted.length > 0) {
      setActiveReportId(formatted[0].id);
    }
  } catch (err) {
    console.error("Failed to load recent reports", err);
  }
  
};
useEffect(() => {
  fetchRecentReports();
}, []);

const generateReportFromBackend = async () => {
  const res = await fetch("http://localhost:4000/api/reports/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reportType: REPORT_TYPE_MAP[reportType],
      period: PERIOD_MAP[period],
      format,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to generate report");
  }

  return data;
};

const handleGenerate = async () => {
  try {
    const data = await generateReportFromBackend();
    await fetchRecentReports();
    window.open(`http://localhost:4000${data.downloadUrl}`, "_blank");
  } catch (err) {
    console.error(err);
    alert("Failed to generate report");
  }
};



  const handleDelete = (id) => {
    const ok = window.confirm("Remove this report from Recent Reports?");
    if (!ok) return;

    setRecentReports((prev) => prev.filter((r) => r.id !== id));
    if (activeReportId === id) setActiveReportId(null);
  };

  const downloadCsv = (report) => {
    const rows = [
      ["Report Name", report.name],
      ["Generated", formatDateTime(report.generatedAt)],
      ["Period", report.period],
      ["Format", report.format],
      [""],
      ["Note", "This is a sample export from TaxPal frontend."],
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(report.name) || "taxpal-report"}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };




  const handlePrint = () => {
    if (!activeReport) return;

    const html = `
      <html>
        <head>
          <title>${activeReport.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            h1 { margin: 0 0 6px; font-size: 20px; }
            p { margin: 0 0 14px; color: #6b7280; }
            .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; }
            .row { display: flex; gap: 14px; margin: 10px 0; }
            .label { width: 120px; color: #6b7280; }
          </style>
        </head>
        <body>
          <h1>TaxPal — Financial Report</h1>
          <p>Generated report preview</p>
          <div class="card">
            <div class="row"><div class="label">Report</div><div>${activeReport.name}</div></div>
            <div class="row"><div class="label">Type</div><div>${activeReport.reportType}</div></div>
            <div class="row"><div class="label">Period</div><div>${activeReport.period}</div></div>
            <div class="row"><div class="label">Generated</div><div>${formatDateTime(activeReport.generatedAt)}</div></div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `;

    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  };
const handleDownload = () => {
  if (!activeReport?.downloadUrl) {
    alert("No downloadable file available");
    return;
  }

  window.open(`http://localhost:4000${activeReport.downloadUrl}`, "_blank");
};



  return (
    <div className="dashboard">
      <Sidebar />

      <main className="page-content reports-page">
        <div className="reports-header">
          <h1>Financial Reports</h1>
          <p>Generate and download your financial reports</p>
        </div>

        <section className="reports-card">
          <div className="reports-card-title">Generate Report</div>

          <div className="reports-form">
            <div className="reports-field">
              <label>Report Type</label>
              <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option>Income Statement</option>
                <option>Expense Summary</option>
                <option>Cash Flow</option>
                <option>Transaction Report</option>
              </select>
            </div>

            <div className="reports-field">
              <label>Period</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option>Current Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>Current Year</option>
              </select>
            </div>

            <div className="reports-field">
              <label>Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option>PDF</option>
                <option>CSV</option>
              </select>
            </div>

            <div className="reports-actions">
              <button type="button" className="btn-secondary" onClick={handleReset}>
                Reset
              </button>
              <button type="button" className="btn-primary" onClick={handleGenerate}>
                Generate Report
              </button>
            </div>
          </div>
        </section>

        <section className="reports-card">
          <div className="reports-card-title">Recent Reports</div>

          <div className="reports-table-wrap">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Generated</th>
                  <th>Period</th>
                  <th>Format</th>
                  <th className="reports-th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="reports-empty">
                      No results.
                    </td>
                  </tr>
                ) : (
                  recentReports.map((r) => (
                    <tr key={r.id} className={r.id === activeReportId ? "is-active" : ""}>
                      <td>{r.name}</td>
                      <td>{formatDateTime(r.generatedAt)}</td>
                      <td>{r.period}</td>
                      <td>
                        <span className={`format-badge ${r.format === "PDF" ? "pdf" : "csv"}`}>
                          {r.format}
                        </span>
                      </td>
                      <td className="reports-actions-cell">
                        <button
                          type="button"
                          className="icon-action"
                          title="Preview"
                          onClick={() => {
  setActiveReportId(r.id);

}}

                        >
                          <FaEye />
                        </button>
                         <button
  type="button"
  className="icon-action"
  title="Download"
  onClick={() => {
    console.log("ROW DATA:", r);
    if (!r.downloadUrl) {
      alert("No downloadable file available");
      return;
    }
    window.open(`http://localhost:4000${r.downloadUrl}`, "_blank");
  }}
>
  <FaDownload />
</button>

                        <button
                          type="button"
                          className="icon-action danger"
                          title="Remove"
                          onClick={() => handleDelete(r.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="reports-card">
          <div className="reports-preview-header">
            <div className="reports-card-title" style={{ margin: 0 }}>
              Report Preview
            </div>

            <div className="reports-preview-actions">
              <button
                type="button"
                className="btn-outline"
                onClick={handlePrint}
                disabled={!activeReport}
              >
                <FaPrint /> Print
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleDownload}
                disabled={!activeReport}
              >
                <FaDownload /> Download
              </button>
            </div>
          </div>

          <div className="reports-preview-body">
            {!activeReport ? (
              <div className="reports-preview-empty">
                <div className="preview-icon" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="preview-empty-title">Select a report to preview</div>
                <div className="preview-empty-subtitle">
                  Generated reports will appear here for review before downloading
                </div>
              </div>
            ) : (
              <div className="reports-preview-card">
                <div className="preview-kicker">TaxPal — Financial Report</div>
                <div className="preview-title">{activeReport.name}</div>

                <div className="preview-meta">
                  <div>
                    <div className="meta-label">Report Type</div>
                    <div className="meta-value">{activeReport.reportType}</div>
                  </div>
                  <div>
                    <div className="meta-label">Period</div>
                    <div className="meta-value">{activeReport.period}</div>
                  </div>
                  <div>
                    <div className="meta-label">Generated</div>
                    <div className="meta-value">{formatDateTime(activeReport.generatedAt)}</div>
                  </div>
                </div>

                <div className="preview-note">
                  This is a frontend preview. For PDF, click Download and choose “Save as PDF” in the print dialog.
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reports;
