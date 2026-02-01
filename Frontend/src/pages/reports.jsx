import { useEffect, useMemo, useState } from "react";
import { FaDownload, FaEye, FaPrint, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import "../styles/reports.css";

const STORAGE_KEY = "taxpal_recent_reports_v1";

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

function Reports() {
  const [reportType, setReportType] = useState("Income Statement");
  const [period, setPeriod] = useState("Current Month");
  const [format, setFormat] = useState("PDF");

  const [recentReports, setRecentReports] = useState([]);
  const [activeReportId, setActiveReportId] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setRecentReports(parsed);
        if (parsed.length > 0) setActiveReportId(parsed[0].id);
      }
    } catch {
      setRecentReports([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentReports));
  }, [recentReports]);

  const activeReport = useMemo(
    () => recentReports.find((r) => r.id === activeReportId) || null,
    [recentReports, activeReportId]
  );

  const handleReset = () => {
    setReportType("Income Statement");
    setPeriod("Current Month");
    setFormat("PDF");
  };

  const handleGenerate = () => {
    const now = new Date();
    const id = `${now.getTime()}`;

    const report = {
      id,
      name: `${reportType} (${period})`,
      reportType,
      period,
      format,
      generatedAt: now.toISOString(),
    };

    setRecentReports((prev) => [report, ...prev].slice(0, 10));
    setActiveReportId(id);
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
    if (!activeReport) return;

    if (activeReport.format === "CSV") {
      downloadCsv(activeReport);
      return;
    }

    // For PDF: trigger Print dialog so user can "Save as PDF".
    handlePrint();
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
                          onClick={() => setActiveReportId(r.id)}
                        >
                          <FaEye />
                        </button>
                        <button
                          type="button"
                          className="icon-action"
                          title="Download"
                          onClick={() => {
                            setActiveReportId(r.id);
                            if (r.format === "CSV") downloadCsv(r);
                            else {
                              // PDF: use print so user can save as PDF
                              setTimeout(handlePrint, 0);
                            }
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
