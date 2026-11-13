import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useJobs } from '../context/JobsContext.jsx';
import { daysFrom } from '../lib/helpers.js';
import JobForm from './JobForm.jsx';
import { BoardIcon, CalendarIcon, DashboardIcon, ListIcon, Logo, SearchIcon, UserIcon } from './Icons.jsx';

const PAGES = {
  '/': { title: 'Dashboard' },
  '/applications': { title: 'Applications' },
  '/board': { title: 'Board', sub: 'Drag a card to change its status' },
  '/interviews': { title: 'Interviews', sub: 'Every interview date you have added' },
  '/profile': { title: 'Profile', sub: 'Manage your account details and password' },
};

export default function Layout() {
  const { user, signOut } = useAuth();
  const { jobs, loading, error, search, setSearch, editing, setEditing, toast } = useJobs();
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem('jobtracker.theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('jobtracker.theme', dark ? 'dark' : 'light');
  }, [dark]);

  const page = PAGES[location.pathname] || PAGES['/'];
  const subtitle =
    page.sub ||
    (location.pathname === '/applications'
      ? `${jobs.length} applications saved`
      : new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }));
  const upcoming = jobs.filter((j) => j.interviewDate && daysFrom(j.interviewDate) >= 0).length;

  const onSearch = (e) => {
    setSearch(e.target.value);
    if (location.pathname === '/') navigate('/applications');
  };

  return (
    <div className="app">
      <aside className="side">
        <div className="brand"><Logo />Job Tracker</div>
        <nav className="nav">
          <NavLink to="/" end><DashboardIcon /><span>Dashboard</span></NavLink>
          <NavLink to="/applications"><ListIcon /><span>Applications</span></NavLink>
          <NavLink to="/board"><BoardIcon /><span>Board</span></NavLink>
          <NavLink to="/interviews">
            <CalendarIcon /><span>Interviews</span>
            {upcoming > 0 && <span className="badge">{upcoming}</span>}
          </NavLink>
          <NavLink to="/profile"><UserIcon /><span>Profile</span></NavLink>
        </nav>
        <div className="spacer" />
        <button className="theme" onClick={() => setDark((d) => !d)}>{dark ? 'Light mode' : 'Dark mode'}</button>
        <div className="me">
          <div className="avatar">{user.name[0]?.toUpperCase()}</div>
          <div className="me-text">
            {user.name}
            <small>{user.email}</small>
          </div>
          <button className="signout" onClick={signOut} title="Sign out">Sign out</button>
        </div>
      </aside>

      <main className="main">
        <div className="top">
          <div className="grow">
            <h1>{page.title}</h1>
            <p>{subtitle}</p>
          </div>
          {location.pathname !== '/profile' && (
            <>
              <label className="searchbox" aria-label="Search">
                <SearchIcon />
                <input value={search} onChange={onSearch} placeholder="Search company or role" />
              </label>
              <button className="btn primary" onClick={() => setEditing({})}>Add application</button>
            </>
          )}
        </div>

        {loading ? (
          <div className="panel empty">Loading your applications…</div>
        ) : error ? (
          <div className="panel empty">{error}</div>
        ) : (
          <Outlet />
        )}
      </main>

      {editing && <JobForm job={editing} onClose={() => setEditing(null)} />}
      <div className={`toast${toast ? ' show' : ''}`} role="status">{toast}</div>
    </div>
  );
}
