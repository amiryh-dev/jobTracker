const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, 'aria-hidden': true };

export const UserIcon = () => (
  <svg {...base}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
export const DashboardIcon = () => (
  <svg {...base}><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></svg>
);
export const ListIcon = () => (
  <svg {...base}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
);
export const BoardIcon = () => (
  <svg {...base}><rect x="3" y="3" width="5" height="18" rx="1.5" /><rect x="10" y="3" width="5" height="12" rx="1.5" /><rect x="17" y="3" width="4" height="8" rx="1.5" /></svg>
);
export const CalendarIcon = () => (
  <svg {...base}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></svg>
);
export const SearchIcon = () => (
  <svg {...base} strokeWidth={2.2}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const Logo = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 26 26" aria-hidden="true">
    <rect x="1" y="7" width="24" height="17" rx="4" fill="#3fb6aa" />
    <path d="M9 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#3fb6aa" strokeWidth="2.2" fill="none" />
    <path d="M1 14h24" stroke="#16202c" strokeWidth="2" />
  </svg>
);
