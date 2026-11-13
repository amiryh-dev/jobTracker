import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJobs } from '../context/JobsContext.jsx';
import JobsTable from '../components/JobsTable.jsx';
import { STATUSES, daysFrom, isOpen } from '../lib/helpers.js';

const FIELDS = ['company', 'position', 'status', 'appliedDate', 'location', 'salary', 'interviewDate',
  'interviewType', 'followUpDate', 'jobLink', 'contact', 'notes'];
const FOLLOW_UPS = [
  ['', 'All follow-ups'],
  ['overdue', 'Overdue'],
  ['today', 'Due today'],
  ['week', 'Next 7 days'],
];

function exportCSV(jobs, filename) {
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [FIELDS.join(','), ...jobs.map((j) => FIELDS.map((f) => q(j[f])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function Applications() {
  const { jobs, matchesSearch, showToast } = useJobs();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState('date-desc');
  const status = params.get('status') || '';
  const requestedFollowUp = params.get('followUp') || '';
  const followUp = FOLLOW_UPS.some(([value]) => value === requestedFollowUp) ? requestedFollowUp : '';

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const matchesFollowUp = (j) => {
    if (!followUp) return true;
    if (!j.followUpDate || !isOpen(j)) return false;
    const days = daysFrom(j.followUpDate);
    if (followUp === 'overdue') return days < 0;
    if (followUp === 'today') return days === 0;
    return days > 0 && days <= 7;
  };

  const rows = jobs
    .filter((j) => (!status || j.status === status) && matchesSearch(j) && matchesFollowUp(j))
    .sort((a, b) => {
      if (sort === 'company') return a.company.localeCompare(b.company);
      if (sort === 'salary') return (b.salary || 0) - (a.salary || 0);
      if (sort === 'follow-up') return (a.followUpDate || '9999').localeCompare(b.followUpDate || '9999');
      const x = a.appliedDate || '9999';
      const y = b.appliedDate || '9999';
      return sort === 'date-asc' ? x.localeCompare(y) : y.localeCompare(x);
    });

  return (
    <>
      <div className="toolbar">
        <div className="chips">
          {[{ key: '' }, ...STATUSES].map((s) => (
            <button key={s.key} className={`chip${status === s.key ? ' on' : ''}`} onClick={() => setFilter('status', s.key)}>
              {s.key || 'All'} <span className="chip-n">{s.key ? jobs.filter((j) => j.status === s.key).length : jobs.length}</span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <select value={followUp} onChange={(e) => setFilter('followUp', e.target.value)} aria-label="Filter by follow-up due date">
          {FOLLOW_UPS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="company">Company A–Z</option>
          <option value="salary">Highest salary</option>
          <option value="follow-up">Follow-up soonest</option>
        </select>
        <button className="btn" onClick={() => { exportCSV(rows, 'job-applications-filtered.csv'); showToast('Filtered CSV downloaded'); }} disabled={!rows.length}>
          Export results CSV
        </button>
        <button className="btn" onClick={() => { exportCSV(jobs, 'job-applications.csv'); showToast('CSV downloaded'); }} disabled={!jobs.length}>
          Export all CSV
        </button>
      </div>
      <p className="muted" role="status">
        Showing {rows.length} of {jobs.length} applications.
        {followUp && ' Follow-up filters exclude Offer and Rejected applications.'}
        {followUp === 'week' && ' Next 7 days means tomorrow through seven days from today.'}
      </p>
      <div className="panel" style={{ padding: '18px 8px 8px' }}>
        <JobsTable rows={rows} />
      </div>
    </>
  );
}
