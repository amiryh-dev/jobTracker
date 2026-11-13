import { Logo } from '../components/Icons.jsx';

const DEMO = [
  { key: 'Applied', n: 12, color: 'var(--s-applied)' },
  { key: 'Interview', n: 4, color: 'var(--s-interview)' },
  { key: 'Offer', n: 1, color: 'var(--s-offer)' },
];

export default function AuthLayout({ children }) {
  return (
    <div className="auth">
      <aside className="auth-art">
        <div className="brand"><Logo size={30} />Job Tracker</div>
        <div className="auth-pitch">
          <h1>Every application, from sent to signed.</h1>
          <p>Track where each job stands, see when to follow up, and keep your interviews in one place.</p>
          <div className="auth-stages" aria-hidden="true">
            {DEMO.map((s) => (
              <div key={s.key}>
                <b>{s.n}</b>
                <span><i style={{ background: s.color }} />{s.key}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="auth-team">Built by Team Next Step · COMP229</p>
      </aside>
      <main className="auth-form">{children}</main>
    </div>
  );
}
