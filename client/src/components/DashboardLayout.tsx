import { useAuth } from "@/_core/hooks/useAuth";
import { mediaUrl } from "@/lib/media";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FormEvent, useState } from "react";

/**
 * Auth gate for /admin. This dashboard has no real backend yet, so this is
 * intentionally a soft, obvious "still in dev" gate — not real security. See
 * useAuth.ts for the reasoning.
 *
 * Once authenticated, this just hands off to AdminDashboard's own layout
 * (topbar + bottom tab bar / desktop rail) — no separate sidebar here.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, user } = useAuth();

  if (loading) {
    return <div className="adm-loading">Loading dashboard…</div>;
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <>{children}</>;
}

function AdminLogin() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = await login(email, password);
    setError(ok ? null : "Email or password is incorrect.");
  };
  return (
    <div className="adm-login">
      <div className="adm-login-image">
        <img src={mediaUrl("hero-red-roof_78e57ca6.jpeg")} alt="Completed JILMEK residence with a finished blue hip roof" />
        <div className="adm-login-image-overlay" />
        <div className="adm-login-image-content">
          <img className="adm-login-logo" src={mediaUrl("logo_22da56e1.png")} alt="JILMEK Roofing & Construction Ltd" style={{ width: 168, maxWidth: 168, height: "auto" }} />
          <h2>Content studio</h2>
          <p>Manage project images and enquiries through the protected API dashboard.</p>
        </div>
      </div>
      <div className="adm-login-panel">
        <form onSubmit={handleSubmit} className="adm-login-form">
          <img className="adm-login-logo adm-login-logo-mobile" src={mediaUrl("logo_22da56e1.png")} alt="JILMEK Roofing & Construction Ltd" style={{ width: 120, maxWidth: 120, height: "auto" }} />
          <div className="adm-login-heading">
            <h1>Sign in to continue</h1>
            <p>Use your administrator email and password.</p>
          </div>
          <label className="adm-login-field">
            <span>Email</span>
            <div className="adm-login-input">
              <Mail size={16} />
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" autoComplete="username" autoFocus />
            </div>
          </label>
          <label className="adm-login-field">
            <span>Password</span>
            <div className="adm-login-input">
              <Lock size={16} />
              <input type={visible ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" autoComplete="current-password" />
              <button type="button" className="adm-login-toggle" onClick={() => setVisible((value) => !value)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
          </label>
          {error && <p className="adm-login-error">{error}</p>}
          <button type="submit" className="adm-primary full adm-login-submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}
