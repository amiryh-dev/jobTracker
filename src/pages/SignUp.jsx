import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthLayout from './AuthLayout.jsx';

export default function SignUp() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) return setError('Fill in your name, email and password.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return setError('The two passwords do not match.');

    setBusy(true);
    setError('');
    try {
      await signUp(form.name.trim(), form.email.trim(), form.password);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={submit} noValidate>
        <h2>Create your account</h2>
        <p className="muted">It takes less than a minute.</p>
        <label>Full name<input name="name" autoComplete="name" value={form.name} onChange={set} autoFocus /></label>
        <label>Email<input type="email" name="email" autoComplete="email" value={form.email} onChange={set} /></label>
        <label>Password<input type="password" name="password" autoComplete="new-password" value={form.password} onChange={set} placeholder="At least 8 characters" /></label>
        <label>Confirm password<input type="password" name="confirm" autoComplete="new-password" value={form.confirm} onChange={set} /></label>
        <div className="err" role="alert">{error}</div>
        <button className="btn primary block" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
        <p className="switch">Already have an account? <Link to="/signin">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
}
