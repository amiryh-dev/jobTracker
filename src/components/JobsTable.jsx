import { useJobs } from '../context/JobsContext.jsx';
import { colorOf, fmtDate, isLate, logoColor } from '../lib/helpers.js';

export function StatusTag({ status }) {
  return (
    <span className="status"><i style={{ background: colorOf(status) }} />{status}</span>
  );
}

export function CompanyCell({ job }) {
  return (
    <div className="co">
      <span className="logo" style={{ background: logoColor(job.company) }}>{job.company[0]?.toUpperCase()}</span>
      <div><b>{job.company}</b><span>{job.position}</span></div>
    </div>
  );
}

export default function JobsTable({ rows, compact = false }) {
  const { setEditing } = useJobs();

  if (!rows.length) {
    return (
      <div className="empty" style={{ padding: '28px 14px' }}>
        No applications match. Try another filter, or add one with Add application.
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Company</th>
          <th>Status</th>
          <th className="hide-sm">Applied</th>
          {!compact && <th className="hide-sm">Location</th>}
          {!compact && <th className="hide-sm">Salary</th>}
          <th>Follow-up</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((j) => (
          <tr key={j.id} tabIndex={0} onClick={() => setEditing(j)} onKeyDown={(e) => e.key === 'Enter' && setEditing(j)}>
            <td><CompanyCell job={j} /></td>
            <td><StatusTag status={j.status} /></td>
            <td className="hide-sm muted">{j.appliedDate ? fmtDate(j.appliedDate) : 'Not yet'}</td>
            {!compact && <td className="hide-sm muted">{j.location || 'None'}</td>}
            {!compact && (
              <td className="hide-sm muted">{j.salary ? `$${Number(j.salary).toLocaleString('en-CA')}` : 'None'}</td>
            )}
            <td>
              {j.followUpDate
                ? <span className={isLate(j) ? 'late-text' : 'muted'}>{fmtDate(j.followUpDate)}</span>
                : <span className="muted">None</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
