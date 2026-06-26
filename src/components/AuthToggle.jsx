import { Link } from "react-router-dom";

function AuthToggle({ active }) {
  return (
    <div className="auth-toggle">
      <Link
        to="/signin"
        className={`auth-toggle-option ${active === "signin" ? "active" : ""}`}
      >
        Sign in
      </Link>
      <Link
        to="/signup"
        className={`auth-toggle-option ${active === "signup" ? "active" : ""}`}
      >
        Sign up
      </Link>
    </div>
  );
}

export default AuthToggle;