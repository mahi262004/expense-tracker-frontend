import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Tags from "./pages/Tags";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import "./styles/dashboard.css";

function AppShell() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/signin" || location.pathname === "/signup";

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/tags" element={<Tags />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;