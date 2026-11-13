import { useJobs } from '../context/JobsContext.jsx';
import { CompanyCell } from '../components/JobsTable.jsx';
import { daysFrom, fmtDate } from '../lib/helpers.js';

export default function Interviews() {
  const { jobs, matchesSearch, setEditing } = useJobs();
  const list = jobs
    .filter((j) => j.interviewDate && matchesSearch(j))
    .sort((a, b) => a.interviewDate.localeCompare(b.interviewDate));
  const upcoming = list.filter((j) => daysFrom(j.interviewDate) >= 0);
  const past = list.filter((j) => daysFrom(j.interviewDate) < 0).reverse();

  const Item = ({ j }) => {
    const d = daysFrom(j.interviewDate);
    return (
      <div className="iv" tabIndex={0} onClick={() => setEditing(j)} onKeyDown={(e) => e.key === 'Enter' && setEditing(j)}>
        <div className="date">
          <b>{fmtDate(j.interviewDate)}</b>
          <span>{d === 0 ? 'Today' : d > 0 ? `In ${d} days` : `${-d} days ago`}</span>
        </div>
        <CompanyCell job={j} />
        {j.interviewType ? <span className="type">{j.interviewType}</span> : <span />}
      </div>
    );
  };

  if (!list.length) {
    return (
      <div className="panel empty">
        No interviews yet. Add an interview date to an application to see it here.
      </div>
    );
  }

  return (
    <div className="panel">
      <h3>Upcoming</h3>
      {upcoming.length ? upcoming.map((j) => <Item key={j.id} j={j} />) : <div className="empty">No upcoming interviews.</div>}
      {past.length > 0 && (
        <>
          <h3 style={{ marginTop: 22 }}>Past</h3>
          {past.map((j) => <Item key={j.id} j={j} />)}
        </>
      )}
    </div>
  );
}
