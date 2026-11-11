import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from './AuthContext.jsx';

const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const { signOut } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null = closed, {} = new, job = edit
  const [toast, setToast] = useState('');
  const toastTimer = useRef();

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2000);
  }, []);

  const handleError = useCallback(
    (err) => {
      if (err.status === 401) signOut();
      throw err;
    },
    [signOut]
  );

  useEffect(() => {
    api('/jobs')
      .then(setJobs)
      .catch((err) => {
        if (err.status === 401) signOut();
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [signOut]);

  const addJob = async (data) => {
    const job = await api('/jobs', { method: 'POST', body: data }).catch(handleError);
    setJobs((list) => [job, ...list]);
    showToast('Application added');
  };

  const updateJob = async (id, data, message = 'Changes saved') => {
    const job = await api(`/jobs/${id}`, { method: 'PUT', body: data }).catch(handleError);
    setJobs((list) => list.map((j) => (j.id === id ? job : j)));
    showToast(message);
  };

  const deleteJob = async (id) => {
    await api(`/jobs/${id}`, { method: 'DELETE' }).catch(handleError);
    setJobs((list) => list.filter((j) => j.id !== id));
    showToast('Application deleted');
  };

  const matchesSearch = (j) => {
    const q = search.trim().toLowerCase();
    return !q || `${j.company} ${j.position} ${j.location}`.toLowerCase().includes(q);
  };

  return (
    <JobsContext.Provider
      value={{
        jobs, loading, error, search, setSearch, matchesSearch,
        addJob, updateJob, deleteJob, editing, setEditing, toast, showToast,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

export const useJobs = () => useContext(JobsContext);
