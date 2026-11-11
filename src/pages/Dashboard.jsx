import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobsContext.jsx';
import JobsTable from '../components/JobsTable.jsx';
import { STATUSES, daysFrom, fmtDate, isOpen, needsFollowUp, toISO } from '../lib/helpers.js';

function WeeklyChart({ jobs }) {
  const weeks = [];
  for (let w = 7; w >= 0; w--) {
    const end = new Date();
    end.setDate(end.getDate() - w * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    const a = toISO(start);
    const b = toISO(end);
    weeks.push({ label: fmtDate(a), n: jobs.filter((j) => j.appliedDate && j.appliedDate >= a && j.appliedDate <= b).length });
  }
  const W = 560, H = 250, pad = 26, plot = H - 50;
  const bw = (W - pad * 2) / weeks.length;
  const top = Math.max(3, ...weeks.map((w) => w.n));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Applications per week">
      {[0, 0.5, 1].map((f) => (
        <line key={f} x1={pad} x2={W - pad} y1={20 + plot * (1 - f)} y2={20 + plot * (1 - f)} stroke="var(--line)" />
      ))}
      {weeks.map((w, i) => {
        const h = (plot * w.n) / top;
        const x = pad + i * bw + bw * 0.22;
        const y = 20 + plot - h;
        const last = i === weeks.length - 1;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw * 0.56} height={Math.max(h, 2)} rx="5"
              fill={last ? 'var(--teal)' : 'var(--teal-soft)'} stroke={last ? 'none' : 'var(--teal)'} strokeOpacity=".35" />
            {w.n > 0 && <text className="val" x={x + bw * 0.28} y={y - 6} textAnchor="middle">{w.n}</text>}
            <text className="lbl" x={x + bw * 0.28} y={H - 10} textAnchor="middle">{last ? 'This week' : w.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Dashboard() {
  const { jobs, setEditing } = useJobs();
  const navigate = useNavigate();

  if (!jobs.length) {
    return (
      <div className="panel welcome">
        <h2>Add your first application</h2>
        <p className="muted">Save a job you applied to, or one you plan to apply to. Your pipeline, follow-ups and weekly progress will show up here.</p>
        <button className="btn primary" onClick={() => setEditing({})}>Add application</button>
      </div>
    );
  }

  const count = (k) => jobs.filter((j) => j.status === k).length;
  const sent = jobs.filter((j) => j.status !== 'Wishlist').length;
  const reached = count('Interview') + count('Offer');
  const max = Math.max(1, ...STATUSES.map((s) => count(s.key)));
  const conv = {
    Wishlist: 'Saved, not sent yet',
    Applied: `${sent} sent in total`,
    Interview: sent ? `${Math.round((reached / sent) * 100)}% of sent reached interview` : '',
    Offer: reached ? `${Math.round((count('Offer') / reached) * 100)}% of interviews became offers` : '',
    Rejected: 'Closed',
  };

  const followUps = jobs.filter(needsFollowUp).sort((a, b) => a.followUpDate.localeCompare(b.followUpDate));
  const recent = [...jobs].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 5);

  return (
    <>
      <section className="pipeline">
        <div className="pipeline-head">
          <h2>Your pipeline</h2>
          <span>{jobs.filter(isOpen).length} active of {jobs.length}</span>
        </div>
        <div className="stages">
          {STATUSES.map((s, i) => (
            <button key={s.key} className={`stage${s.key === 'Rejected' ? ' closed' : ''}`}
              onClick={() => navigate(`/applications?status=${s.key}`)} aria-label={`Show ${s.key} applications`}>
              <div className="n">{count(s.key)}</div>
              <div className="name"><span className="dot" style={{ background: s.color }} />{s.key}</div>
              <div className="track">
                <div className="fill" style={{ width: `${(count(s.key) / max) * 100}%`, background: s.color, animationDelay: `${i * 70}ms` }} />
              </div>
              <div className="conv">{conv[s.key]}</div>
            </button>
          ))}
        </div>
      </section>

      <div className="row">
        <section className="panel chart">
          <h3>Applications per week</h3>
          <p className="sub">Last 8 weeks, by date applied</p>
          <WeeklyChart jobs={jobs} />
        </section>
        <section className="panel">
          <h3>Follow up</h3>
          <p className="sub">Overdue or due in the next 7 days</p>
          {followUps.length ? followUps.map((j) => {
            const d = daysFrom(j.followUpDate);
            const when = d < 0 ? `${-d}d late` : d === 0 ? 'Today' : `in ${d}d`;
            return (
              <div key={j.id} className={`fu${d <= 0 ? ' late' : ''}`} tabIndex={0}
                onClick={() => setEditing(j)} onKeyDown={(e) => e.key === 'Enter' && setEditing(j)}>
                <div className="when"><b>{new Date(`${j.followUpDate}T00:00`).getDate()}</b><small>{when}</small></div>
                <div className="who"><b>{j.company}</b><span>{j.position}</span></div>
              </div>
            );
          }) : (
            <div className="empty">No follow-ups this week. Set a follow-up date on an application to see it here.</div>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel-head">
          <div><h3>Recent applications</h3><p className="sub">The five you added most recently</p></div>
          <Link className="link" to="/applications">See all</Link>
        </div>
        <JobsTable rows={recent} compact />
      </section>
    </>
  );
}
