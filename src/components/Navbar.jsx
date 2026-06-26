import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <nav>
      <Link to="/">Dashboard</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/budgets">Budgets</Link>
      <Link to="/tags">Tags</Link>

      {token ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <Link to="/signup">Sign Up</Link>
          <Link to="/signin">Sign In</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;