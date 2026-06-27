import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const NAV_ITEMS = [
  { to: "/", icon: "ti-layout-dashboard", label: "Dashboard" },
  { to: "/transactions", icon: "ti-arrows-exchange", label: "Transactions" },
  { to: "/budgets", icon: "ti-wallet", label: "Budgets" },
  { to: "/tags", icon: "ti-tags", label: "Tags" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <polygon
            points="9,1 17,9 9,17 1,9"
            fill="none"
            stroke="var(--grey)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-icon ${
              location.pathname === item.to ? "active" : ""
            }`}
            title={item.label}
          >
            <i className={`ti ${item.icon}`} aria-hidden="true"></i>
          </Link>
        ))}
      </div>

      <div className="sidebar-spacer"></div>

      <button
        className="sidebar-icon sidebar-logout"
        onClick={handleLogout}
        title="Logout"
        aria-label="Logout"
      >
        <i className="ti ti-logout" aria-hidden="true"></i>
      </button>
    </div>
  );
}

export default Sidebar;