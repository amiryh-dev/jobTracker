import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJobs } from '../context/JobsContext.jsx';
import JobsTable from '../components/JobsTable.jsx';
import { STATUSES } from '../lib/helpers.js';

const FIELDS = ['company', 'position', 'status', 'appliedDate', 'location', 'salary', 'interviewDate',
  'interviewType', 'followUpDate', 'jobLink', 'contact', 'notes'];

function exportCSV(jobs) {
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [FIELDS.join(','), ...jobs.map((j) => FIELDS.map((f) => q(j[f])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'job-applications.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function Applications() {
  const { jobs, matchesSearch, showToast } = useJobs();
  const [params, setParams] = useSearchParams();
  const [sort, setSort] = useState('date-desc');
  const status = params.get('status') || '';

  const setStatus = (s) => setParams(s ? { status: s } : {});

  const rows = jobs
    .filter((j) => (!status || j.status === status) && matchesSearch(j))
    .sort((a, b) => {
      if (sort === 'company') return a.company.localeCompare(b.company);
      if (sort === 'salary') return (b.salary || 0) - (a.salary || 0);
      const x = a.appliedDate || '9999';
      const y = b.appliedDate || '9999';
      return sort === 'date-asc' ? x.localeCompare(y) : y.localeCompare(x);
    });

  return (
    <>
      <div className="toolbar">
        <div className="chips">
          {[{ key: '' }, ...STATUSES].map((s) => (
            <button key={s.key} className={`chip${status === s.key ? ' on' : ''}`} onClick={() => setStatus(s.key)}>
              {s.key || 'All'} <span className="chip-n">{s.key ? jobs.filter((j) => j.status === s.key).length : jobs.length}</span>
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="company">Company A–Z</option>
          <option value="salary">Highest salary</option>
        </select>
        <button className="btn" onClick={() => { exportCSV(jobs); showToast('CSV downloaded'); }} disabled={!jobs.length}>
          Export CSV
        </button>
      </div>
      <div className="panel" style={{ padding: '18px 8px 8px' }}>
        <JobsTable rows={rows} />
      </div>
    </>
  );
}
