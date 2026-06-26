import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTransactions } from "../api";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin"); 
      return;
    }

    getTransactions(token)
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.value, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.value, 0);

  const balance = totalIncome - totalExpense;

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <div>
          <h3>Balance</h3>
          <p>₹{balance}</p>
        </div>
        <div>
          <h3>Total Income</h3>
          <p>₹{totalIncome}</p>
        </div>
        <div>
          <h3>Total Expenses</h3>
          <p>₹{totalExpense}</p>
        </div>
      </div>

      <h2>Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        transactions.slice(0, 5).map((t) => (
          <div key={t._id}>
            <span>{t.transactionName}</span>
            <span>{t.type === "income" ? "+" : "-"}₹{t.value}</span>
            <span>{new Date(t.date).toLocaleDateString()}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;