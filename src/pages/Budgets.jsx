import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBudgets, deleteBudget, getTransactions } from "../api";
import AddBudgetModal from "../components/AddBudgetModal";
import "../styles/dashboard.css";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }
    loadData();
  }, []);

  const loadData = () => {
    Promise.all([getBudgets(token), getTransactions(token)])
      .then(([budgetsRes, txRes]) => {
        setBudgets(budgetsRes.data);
        setTransactions(txRes.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleAddClick = () => {
    setEditingBudget(null);
    setModalOpen(true);
  };

  const handleEditClick = (b) => {
    setEditingBudget(b);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBudget(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this budget? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteBudget(id, token);
      loadData();
    } catch (err) {
      setError("Failed to delete budget");
    }
  };


  const getSpentForBudget = (budgetTagId, budgetMonth) => {
    const budgetMonthStr = new Date(budgetMonth).toISOString().slice(0, 7);
    return transactions
      .filter((t) => {
        const tTagId = t.tag?._id || t.tag;
        const tMonthStr = new Date(t.date).toISOString().slice(0, 7);
        return (
          tTagId === budgetTagId &&
          tMonthStr === budgetMonthStr &&
          t.type === "expense"
        );
      })
      .reduce((sum, t) => sum + t.value, 0);
  };

  if (loading) {
    return <div className="dash-loading">Loading...</div>;
  }

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <div className="dash-welcome">Stay on track</div>
          <h1 className="dash-title">Budgets</h1>
        </div>
        <button className="dash-add-btn" onClick={handleAddClick}>
          <span className="dash-add-plus">+</span> Set budget
        </button>
      </div>

      {error && <div className="modal-error">{error}</div>}

      {budgets.length === 0 ? (
        <div className="dash-panel">
          <p className="dash-empty">
            No budgets set yet. Click "Set budget" to add one.
          </p>
        </div>
      ) : (
        <div className="budget-grid">
          {budgets.map((b) => {
            const spent = getSpentForBudget(b.tag?._id || b.tag, b.month);
            const remaining = b.amount - spent;
            const isOver = remaining < 0;
            const percentUsed = Math.min((spent / b.amount) * 100, 100);

            return (
              <div
                key={b._id}
                className={`budget-card ${isOver ? "budget-card-over" : ""}`}
              >
                <div className="budget-card-header">
                  <div>
                    <div className="budget-card-name">
                      {b.tag?.name || "Unknown tag"}
                    </div>
                    <div className="budget-card-month">
                      {new Date(b.month).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="tx-actions">
                    <button
                      className="tx-action-btn"
                      onClick={() => handleEditClick(b)}
                      aria-label="Edit budget"
                      type="button"
                    >
                      <i className="ti ti-pencil" aria-hidden="true"></i>
                    </button>
                    <button
                      className="tx-action-btn tx-action-btn-danger"
                      onClick={() => handleDelete(b._id)}
                      aria-label="Delete budget"
                      type="button"
                    >
                      <i className="ti ti-x" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>

                <div className="budget-stat">
                  Budget ₹{b.amount.toLocaleString()}
                </div>
                <div className="budget-stat">
                  Spent ₹{spent.toLocaleString()}
                </div>
                <div
                  className={`budget-stat-highlight ${
                    isOver ? "budget-over-text" : "budget-under-text"
                  }`}
                >
                  {isOver
                    ? `Over by ₹${Math.abs(remaining).toLocaleString()}`
                    : `Remaining ₹${remaining.toLocaleString()}`}
                </div>

                <div className="budget-progress-track">
                  <div
                    className={`budget-progress-fill ${
                      isOver ? "budget-progress-over" : ""
                    }`}
                    style={{ width: `${percentUsed}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <AddBudgetModal
          budgetItem={editingBudget}
          onClose={handleCloseModal}
          onSaved={() => {
            handleCloseModal();
            loadData();
          }}
        />
      )}
    </div>
  );
}

export default Budgets;