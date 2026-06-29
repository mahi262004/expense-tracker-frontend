import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../api";
import AuthLayout from "../components/AuthLayout";
import AuthToggle from "../components/AuthToggle";
import "../styles/auth.css";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await signup({ username, email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        setError(res.data.message); 
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <AuthLayout
      toggle={<AuthToggle active="signup" />}
      title="Create your account"
      subtitle="Track every rupee, one tag at a time."
    >
      <form onSubmit={handleSubmit}>
        <div className="auth-field">
          <label className="auth-label">Username</label>
          <input
            className="auth-input"
            type="text"
            placeholder="yourname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="auth-button" type="submit">
          Create account
        </button>
      </form>

      {error && <div className="auth-error">{error}</div>}
    </AuthLayout>
  );
}

export default Signup;