import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions, deleteTransaction } from "../api";
import AddExpenseModal from "../components/AddExpenseModal";
import "../styles/dashboard.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [error, setError] = useState("");
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

  const handleAddClick = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleEditClick = (t) => {
    setEditingTransaction(t);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this transaction? This cannot be undone."
    );
    if (!confirmed) return;

    try {
      await deleteTransaction(id, token);
      loadTransactions();
    } catch (err) {
      setError("Failed to delete transaction");
    }
  };

  if (loading) {
    return <div className="dash-loading">Loading...</div>;
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="dash-page">
      <div className="dash-header">
        <div>
          <div className="dash-welcome">All activity</div>
          <h1 className="dash-title">Transactions</h1>
        </div>
        <button className="dash-add-btn" onClick={handleAddClick}>
          <span className="dash-add-plus">+</span> Add transaction
        </button>
      </div>

      {error && <div className="modal-error">{error}</div>}

      <div className="dash-panel">
        <div className="dash-panel-title">All transactions</div>

        {sorted.length === 0 ? (
          <p className="dash-empty">
            No transactions yet. Add your first one above.
          </p>
        ) : (
          sorted.map((t) => (
            <div key={t._id} className="tx-row">
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

              <div className="tx-actions">
                <button
                  className="tx-action-btn"
                  onClick={() => handleEditClick(t)}
                  aria-label="Edit transaction"
                  type="button"
                >
                  <i className="ti ti-pencil" aria-hidden="true"></i>
                </button>
                <button
                  className="tx-action-btn tx-action-btn-danger"
                  onClick={() => handleDelete(t._id)}
                  aria-label="Delete transaction"
                  type="button"
                >
                  <i className="ti ti-x" aria-hidden="true"></i>
                </button>
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
          title={editingTransaction ? "Edit transaction" : "Add transaction"}
          transaction={editingTransaction}
          onClose={handleCloseModal}
          onSaved={() => {
            handleCloseModal();
            loadTransactions();
          }}
        />
      )}
    </div>
  );
}

export default Transactions;