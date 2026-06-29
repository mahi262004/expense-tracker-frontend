import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin } from "../api";
import AuthLayout from "../components/AuthLayout";
import AuthToggle from "../components/AuthToggle";
import "../styles/auth.css";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await signin({ email, password });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      const data = err.response?.data;
      const message =
        data?.errors?.map((e) => e.message).join(", ") ||
        data?.message ||
        "Something went wrong. Try again.";
      setError(message);
    }
  };

  return (
    <AuthLayout
      toggle={<AuthToggle active="signin" />}
      title="Welcome back"
      subtitle="Sign in to see where your money went."
    >
      <form onSubmit={handleSubmit}>
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
          Sign in
        </button>
      </form>

      {error && <div className="auth-error">{error}</div>}
    </AuthLayout>
  );
}

export default Signin;