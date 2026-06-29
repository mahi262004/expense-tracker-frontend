import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../api";
import AddExpenseModal from "../components/AddExpenseModal";
import "../styles/dashboard.css";

const DONUT_COLORS = [
  "#c9a24b",
  "#e0944a",
  "#b4694f",
  "#6f9c87",
  "#6f87a8",
  "#97698c",
];

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    getTransactions(token)
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  if (loading) {
    return <div className="dash-loading">Loading...</div>;
  }

  
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.value, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.value, 0);

  const balance = totalIncome - totalExpense;

  
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const dailyExpenses = last7Days.map((day) => {
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    return transactions
      .filter((t) => {
        const txDate = new Date(t.date);
        return t.type === "expense" && txDate >= day && txDate < next;
      })
      .reduce((sum, t) => sum + t.value, 0);
  });

  const maxDaily = Math.max(...dailyExpenses, 1);
  const chartW = 540;
  const chartH = 110;
  const stepX = chartW / 6;
  const points = dailyExpenses.map((val, i) => {
    const x = i * stepX;
    const y = chartH - (val / maxDaily) * (chartH - 20) - 10;
    return [Math.round(x), Math.round(y)];
  });
  const polylinePoints = points.map((p) => p.join(",")).join(" ");
  const areaPath = `M ${points[0][0]},${chartH} L ${points
    .map((p) => p.join(","))
    .join(" L ")} L ${points[points.length - 1][0]},${chartH} Z`;

  const hasSpending = dailyExpenses.some((v) => v > 0);

  
  const tagTotals = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const tagName = t.tag?.name || "Untagged";
      tagTotals[tagName] = (tagTotals[tagName] || 0) + t.value;
    });

  const sortedTags = Object.entries(tagTotals).sort((a, b) => b[1] - a[1]);
  const topTags = sortedTags.slice(0, 5);
  const otherTotal = sortedTags.slice(5).reduce((sum, [, v]) => sum + v, 0);
  if (otherTotal > 0) topTags.push(["Other", otherTotal]);

  const totalTagged = topTags.reduce((sum, [, v]) => sum + v, 0) || 1;

  const donutSegments = topTags.map(([name, value], i) => ({
    name,
    value,
    percent: Math.round((value / totalTagged) * 100),
    color: DONUT_COLORS[i % DONUT_COLORS.length],
  }));

  const r = 32;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;
  const donutArcs = donutSegments.map((seg) => {
    const len = (seg.value / totalTagged) * circumference;
    const arc = {
      ...seg,
      dasharray: `${len} ${circumference}`,
      dashoffset: -cumulative,
    };
    cumulative += len;
    return arc;
  });

 
  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <div className="dash-welcome">Welcome back</div>
          <h1 className="dash-title">Dashboard</h1>
        </div>
        <button className="dash-add-btn" onClick={() => setModalOpen(true)}>
          <span className="dash-add-plus">+</span> Add expense
        </button>
      </div>

      <div className="dash-kpi-row">
        <div className="dash-kpi-card dash-kpi-primary">
          <div className="dash-kpi-icon dash-kpi-icon-gold">
            <i className="ti ti-wallet" aria-hidden="true"></i>
          </div>
          <div className="dash-kpi-label">Balance</div>
          <div className="dash-kpi-value">₹{balance.toLocaleString()}</div>
        </div>
        <div className="dash-kpi-card">
          <div className="dash-kpi-icon dash-kpi-icon-amber">
            <i className="ti ti-trending-up" aria-hidden="true"></i>
          </div>
          <div className="dash-kpi-label">Income</div>
          <div className="dash-kpi-value">
            ₹{totalIncome.toLocaleString()}
          </div>
        </div>
        <div className="dash-kpi-card">
          <div className="dash-kpi-icon dash-kpi-icon-rose">
            <i className="ti ti-trending-down" aria-hidden="true"></i>
          </div>
          <div className="dash-kpi-label">Expenses</div>
          <div className="dash-kpi-value">
            ₹{totalExpense.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="dash-charts-row">
        <div className="dash-panel">
          <div className="dash-panel-title">Spending trend</div>
          {!hasSpending ? (
            <p className="dash-empty">No expenses this week yet</p>
          ) : (
            <>
              <svg
                viewBox={`0 0 ${chartW} ${chartH + 10}`}
                className="dash-trend-svg"
                preserveAspectRatio="none"
              >
                <path d={areaPath} className="dash-trend-area" />
                <polyline
                  points={polylinePoints}
                  className="dash-trend-line"
                />
                {points.map((p, i) => (
                  <circle
                    key={i}
                    cx={p[0]}
                    cy={p[1]}
                    r="3"
                    className="dash-trend-dot"
                  />
                ))}
              </svg>
              <div className="dash-trend-labels">
                {last7Days.map((d, i) => (
                  <span key={i}>
                    {d.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-title">Expense breakdown</div>
          {donutSegments.length === 0 ? (
            <p className="dash-empty">No expenses yet</p>
          ) : (
            <>
              <div className="dash-donut-wrap">
                <svg viewBox="0 0 88 88" className="dash-donut-svg">
                  {donutArcs.map((arc, i) => (
                    <circle
                      key={i}
                      cx="44"
                      cy="44"
                      r={r}
                      stroke={arc.color}
                      strokeWidth="13"
                      fill="none"
                      strokeDasharray={arc.dasharray}
                      strokeDashoffset={arc.dashoffset}
                      transform="rotate(-90 44 44)"
                    />
                  ))}
                </svg>
                <div className="dash-donut-center">
                  <div className="dash-donut-center-label">Spent</div>
                  <div className="dash-donut-center-value">
                    ₹{totalExpense.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="dash-legend">
                {donutSegments.map((seg, i) => (
                  <div key={i} className="dash-legend-row">
                    <span
                      className="dash-legend-dot"
                      style={{ background: seg.color }}
                    ></span>
                    <span className="dash-legend-name">{seg.name}</span>
                    <span className="dash-legend-percent">
                      {seg.percent}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="dash-panel">
        <div className="dash-panel-header">
          <div className="dash-panel-title">Recent transactions</div>
          <a href="/transactions" className="dash-view-all">
            View all
          </a>
        </div>
        {recent.length === 0 ? (
          <p className="dash-empty">No transactions yet</p>
        ) : (
          recent.map((t) => (
            <div key={t._id} className="dash-tx-row">
              <div
                className={`dash-tx-icon ${
                  t.type === "income"
                    ? "dash-tx-icon-income"
                    : "dash-tx-icon-expense"
                }`}
              >
                <i
                  className={`ti ${
                    t.type === "income"
                      ? "ti-arrow-down-left"
                      : "ti-arrow-up-right"
                  }`}
                  aria-hidden="true"
                ></i>
              </div>
              <div className="dash-tx-info">
                <div className="dash-tx-name">{t.transactionName}</div>
                <div className="dash-tx-sub">
                  {t.tag?.name || "No tag"} ·{" "}
                  {new Date(t.date).toLocaleDateString()}
                </div>
              </div>
              <div
                className={`dash-tx-amount ${
                  t.type === "income"
                    ? "dash-tx-amount-income"
                    : "dash-tx-amount-expense"
                }`}
              >
                {t.type === "income" ? "+" : "-"}₹{t.value.toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <AddExpenseModal
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            loadTransactions();
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;