import { useEffect, useState } from 'react';
import { useJobs } from '../context/JobsContext.jsx';
import { INTERVIEW_TYPES, STATUSES, today } from '../lib/helpers.js';

const EMPTY = {
  company: '', position: '', status: 'Applied', appliedDate: today(), location: '', salary: '',
  interviewDate: '', interviewType: '', followUpDate: '', jobLink: '', contact: '', notes: '',
};

export default function JobForm({ job, onClose }) {
  const { addJob, updateJob, deleteJob } = useJobs();
  const isEdit = Boolean(job.id);
  const [form, setForm] = useState(() => ({ ...EMPTY, ...job, salary: job.salary ?? '' }));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim()) {
      return setError('Add a company and a role to save this application.');
    }
    if (form.jobLink && !/^https?:\/\//i.test(form.jobLink)) {
      return setError('The job posting link must start with http:// or https://');
    }
    const { id, createdAt, updatedAt, ...data } = form; // eslint-disable-line no-unused-vars
    data.salary = data.salary === '' ? null : Number(data.salary);

    setSaving(true);
    setError('');
    try {
      if (isEdit) await updateJob(job.id, data);
      else await addJob(data);
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const remove = async () => {
    setSaving(true);
    try {
      await deleteJob(job.id);
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
      setConfirming(false);
    }
  };

  return (
    <div className="overlay show" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      {confirming ? (
        <div className="modal" style={{ maxWidth: 400 }}>
          <h2>Delete this application?</h2>
          <p className="muted" style={{ marginTop: -6 }}>
            {job.company} will be removed from every view. This can't be undone.
          </p>
          <div className="foot">
            <span />
            <div>
              <button className="btn" onClick={() => setConfirming(false)}>Keep it</button>
              <button className="btn primary danger-fill" onClick={remove} disabled={saving}>Delete</button>
            </div>
          </div>
        </div>
      ) : (
        <form className="modal" onSubmit={submit} noValidate>
          <h2>{isEdit ? `Edit ${job.company}` : 'Add application'}</h2>
          <div className="form-grid">
            <label>Company<input name="company" value={form.company} onChange={set} autoFocus /></label>
            <label>Role<input name="position" value={form.position} onChange={set} /></label>
            <label>Status
              <select name="status" value={form.status} onChange={set}>
                {STATUSES.map((s) => <option key={s.key}>{s.key}</option>)}
              </select>
            </label>
            <label>Date applied<input type="date" name="appliedDate" value={form.appliedDate} onChange={set} /></label>
            <label>Location<input name="location" value={form.location} onChange={set} placeholder="Toronto or Remote" /></label>
            <label>Salary (CAD per year)<input type="number" min="0" step="1000" name="salary" value={form.salary} onChange={set} /></label>
            <label>Interview date<input type="date" name="interviewDate" value={form.interviewDate} onChange={set} /></label>
            <label>Interview type
              <select name="interviewType" value={form.interviewType} onChange={set}>
                <option value="">None</option>
                {INTERVIEW_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label>Follow-up date<input type="date" name="followUpDate" value={form.followUpDate} onChange={set} /></label>
            <label>Job posting link<input name="jobLink" value={form.jobLink} onChange={set} placeholder="https://" /></label>
            <label className="full">Recruiter<input name="contact" value={form.contact} onChange={set} placeholder="Name and email" /></label>
            <label className="full">Notes<textarea name="notes" rows="3" value={form.notes} onChange={set} /></label>
          </div>
          <div className="err" role="alert">{error}</div>
          <div className="foot">
            {isEdit ? (
              <button type="button" className="btn danger" onClick={() => setConfirming(true)}>Delete</button>
            ) : <span />}
            <div>
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn primary" disabled={saving}>
                {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add application'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
