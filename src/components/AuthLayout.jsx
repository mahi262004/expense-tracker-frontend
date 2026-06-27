import NebulaDust from "./NebulaDust";
import shoppingBag from "../assets/icons/shopping-bag.png";
import coffeeCup from "../assets/icons/coffee-cup.png";
import money from "../assets/icons/money.png";

function AuthLayout({ toggle, title, subtitle, children }) {
  return (
    <div className="auth-page">
      <div className="auth-context">
        <div className="auth-glow auth-glow-1"></div>
        <div className="auth-glow auth-glow-2"></div>
        <NebulaDust count={70} />

        <div className="auth-brand">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <polygon
              points="9,1 17,9 9,17 1,9"
              fill="none"
              stroke="var(--auth-grey)"
              strokeWidth="1"
            />
          </svg>
          <span>Expense tracker</span>
        </div>

        <div className="auth-headline">
          <h1>
            See where every <span className="auth-gold-text">penny</span>{" "}
            goes.
          </h1>
          <p>
            Track spending, tag transactions, and stay within budget, all in
            one place.
          </p>
        </div>

        <div className="sticker sticker-bag">
          <img src={shoppingBag} alt="" aria-hidden="true" />
        </div>
        <div className="sticker sticker-cup">
          <img src={coffeeCup} alt="" aria-hidden="true" />
        </div>
        <div className="sticker sticker-money">
          <img src={money} alt="" aria-hidden="true" />
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-glass-card">
          {toggle}
          <h2 className="auth-card-title">{title}</h2>
          {subtitle && <p className="auth-card-subtitle">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;