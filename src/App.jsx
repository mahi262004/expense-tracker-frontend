import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Tags from "./pages/Tags";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"             element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets"      element={<Budgets />} />
        <Route path="/tags"         element={<Tags />} />
        <Route path="/signup"       element={<Signup />} />
        <Route path="/signin"       element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;