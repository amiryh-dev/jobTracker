import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useJobs } from '../context/JobsContext.jsx';

// Profile page: Read (GET /api/users/me via auth), Update (PUT /api/users/me)
// and Delete (DELETE /api/users/me) for the signed-in user.
export default function Profile() {
  const { user, updateProfile, deleteAccount } = useAuth();
  const { jobs, showToast } = useJobs();

  // ----- Account details -----
  const [details, setDetails] = useState({ name: user.name, email: user.email, currentPassword: '' });
  const [detailsError, setDetailsError] = useState('');
  const [savingDetails, setSavingDetails] = useState(false);
  const emailChanged = details.email.trim().toLowerCase() !== user.email;
  const detailsChanged = details.name.trim() !== user.name || emailChanged;

  const saveDetails = async (e) => {
    e.preventDefault();
    if (!details.name.trim()) return setDetailsError('Name cannot be empty.');
    if (!/^\S+@\S+\.\S+$/.test(details.email)) return setDetailsError('Enter a valid email address.');
    if (emailChanged && !details.currentPassword) return setDetailsError('Enter your current password to change your email.');

    setSavingDetails(true);
    setDetailsError('');
    try {
      const body = { name: details.name.trim() };
      if (emailChanged) Object.assign(body, { email: details.email.trim(), currentPassword: details.currentPassword });
      const updated = await updateProfile(body);
      setDetails({ name: updated.name, email: updated.email, currentPassword: '' });
      showToast('Profile updated');
    } catch (err) {
      setDetailsError(err.message);
    } finally {
      setSavingDetails(false);
    }
  };

  // ----- Change password -----
  const [pw, setPw] = useState({ currentPassword: '', password: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [savingPw, setSavingPw] = useState(false);

  const savePassword = async (e) => {
    e.preventDefault();
    if (!pw.currentPassword || !pw.password) return setPwError('Fill in your current and new password.');
    if (pw.password.length < 8) return setPwError('New password must be at least 8 characters.');
    if (pw.password !== pw.confirm) return setPwError('The two new passwords do not match.');

    setSavingPw(true);
    setPwError('');
    try {
      await updateProfile({ password: pw.password, currentPassword: pw.currentPassword });
      setPw({ currentPassword: '', password: '', confirm: '' });
      showToast('Password changed');
    } catch (err) {
      setPwError(err.message);
    } finally {
      setSavingPw(false);
    }
  };

  // ----- Delete account -----
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePw, setDeletePw] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const removeAccount = async (e) => {
    e.preventDefault();
    if (!deletePw) return setDeleteError('Enter your password to confirm.');
    setDeleting(true);
    setDeleteError('');
    try {
      await deleteAccount(deletePw); // signs out → app redirects to /signin
    } catch (err) {
      setDeleteError(err.message);
      setDeleting(false);
    }
  };

  const setField = (setter) => (e) => setter((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="profile">
      <div className="panel profile-card">
        <div className="profile-head">
          <div className="avatar lg">{user.name[0]?.toUpperCase()}</div>
          <div>
            <h3>{user.name}</h3>
            <p className="muted">{user.email} · {jobs.length} applications saved</p>
          </div>
        </div>
      </div>

      <div className="row profile-row">
        <form className="panel" onSubmit={saveDetails} noValidate>
          <h3>Account details</h3>
          <p className="sub">Update your name or email address.</p>
          <div className="stack">
            <label>Full name
              <input name="name" autoComplete="name" value={details.name} onChange={setField(setDetails)} />
            </label>
            <label>Email
              <input type="email" name="email" autoComplete="email" value={details.email} onChange={setField(setDetails)} />
            </label>
            {emailChanged && (
              <label>Current password
                <input type="password" name="currentPassword" autoComplete="current-password"
                  value={details.currentPassword} onChange={setField(setDetails)} placeholder="Needed to change your email" />
              </label>
            )}
          </div>
          <div className="err" role="alert">{detailsError}</div>
          <button className="btn primary" disabled={savingDetails || !detailsChanged}>
            {savingDetails ? 'Saving…' : 'Save changes'}
          </button>
        </form>

        <form className="panel" onSubmit={savePassword} noValidate>
          <h3>Change password</h3>
          <p className="sub">Use at least 8 characters.</p>
          <div className="stack">
            <label>Current password
              <input type="password" name="currentPassword" autoComplete="current-password" value={pw.currentPassword} onChange={setField(setPw)} />
            </label>
            <label>New password
              <input type="password" name="password" autoComplete="new-password" value={pw.password} onChange={setField(setPw)} />
            </label>
            <label>Confirm new password
              <input type="password" name="confirm" autoComplete="new-password" value={pw.confirm} onChange={setField(setPw)} />
            </label>
          </div>
          <div className="err" role="alert">{pwError}</div>
          <button className="btn primary" disabled={savingPw}>{savingPw ? 'Saving…' : 'Change password'}</button>
        </form>
      </div>

      <div className="panel danger-zone">
        <h3>Delete account</h3>
        <p className="sub">
          This permanently deletes your account and all {jobs.length} of your saved applications. It cannot be undone.
        </p>
        {!confirmDelete ? (
          <button className="btn danger" onClick={() => setConfirmDelete(true)}>Delete my account</button>
        ) : (
          <form onSubmit={removeAccount} noValidate>
            <div className="delete-confirm">
              <label>Enter your password to confirm
                <input type="password" autoComplete="current-password" value={deletePw}
                  onChange={(e) => setDeletePw(e.target.value)} autoFocus />
              </label>
              <button className="btn primary danger-fill" disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete permanently'}
              </button>
              <button type="button" className="btn" onClick={() => { setConfirmDelete(false); setDeletePw(''); setDeleteError(''); }}>
                Cancel
              </button>
            </div>
            <div className="err" role="alert">{deleteError}</div>
          </form>
        )}
      </div>
    </div>
  );
}
