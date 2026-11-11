import { useState } from 'react';
import { useJobs } from '../context/JobsContext.jsx';
import { STATUSES, isLate } from '../lib/helpers.js';

export default function Board() {
  const { jobs, matchesSearch, updateJob, setEditing, showToast } = useJobs();
  const [over, setOver] = useState('');
  const [dragId, setDragId] = useState('');

  const drop = async (status) => {
    setOver('');
    const job = jobs.find((j) => j.id === dragId);
    setDragId('');
    if (!job || job.status === status) return;
    try {
      await updateJob(job.id, { status }, `Moved ${job.company} to ${status}`);
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <div className="board">
      {STATUSES.map((s) => {
        const items = jobs.filter((j) => j.status === s.key && matchesSearch(j));
        return (
          <div key={s.key} className={`col${over === s.key ? ' over' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setOver(s.key); }}
            onDragLeave={() => setOver('')}
            onDrop={(e) => { e.preventDefault(); drop(s.key); }}>
            <h3><i style={{ background: s.color }} />{s.key}<span>{items.length}</span></h3>
            {items.length ? items.map((j) => (
              <div key={j.id} className={`card${dragId === j.id ? ' dragging' : ''}`} draggable tabIndex={0}
                onDragStart={() => setDragId(j.id)} onDragEnd={() => setDragId('')}
                onClick={() => setEditing(j)} onKeyDown={(e) => e.key === 'Enter' && setEditing(j)}>
                <b>{j.company}</b>
                <span>{j.position}</span>
                <div className="meta">
                  <span>{j.location}</span>
                  {isLate(j) && <span className="late-text">Follow up</span>}
                </div>
              </div>
            )) : <div className="drop-hint">Drag a card here</div>}
          </div>
        );
      })}
    </div>
  );
}
