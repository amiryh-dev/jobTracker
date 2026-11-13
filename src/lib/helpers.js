export const STATUSES = [
  { key: 'Wishlist', color: 'var(--s-wish)' },
  { key: 'Applied', color: 'var(--s-applied)' },
  { key: 'Interview', color: 'var(--s-interview)' },
  { key: 'Offer', color: 'var(--s-offer)' },
  { key: 'Rejected', color: 'var(--s-rejected)' },
];
export const INTERVIEW_TYPES = ['Phone screen', 'Technical', 'Behavioural', 'On-site'];

export const colorOf = (status) => (STATUSES.find((s) => s.key === status) || STATUSES[0]).color;

const LOGO_COLORS = ['#2f6fd0', '#0e7c74', '#7c6fd6', '#c2412d', '#c27a0e', '#3d4f63', '#a3456f'];
export const logoColor = (name = '') =>
  LOGO_COLORS[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % LOGO_COLORS.length];

// ----- dates (stored as "YYYY-MM-DD") -----
export const toISO = (d) => {
  const z = new Date(d);
  z.setMinutes(z.getMinutes() - z.getTimezoneOffset());
  return z.toISOString().slice(0, 10);
};
export const today = () => toISO(new Date());
export const daysFrom = (s) => Math.round((new Date(`${s}T00:00`) - new Date(`${today()}T00:00`)) / 864e5);
export const fmtDate = (s) =>
  s ? new Date(`${s}T00:00`).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) : '';

export const isOpen = (j) => !['Offer', 'Rejected'].includes(j.status);
export const needsFollowUp = (j) => j.followUpDate && isOpen(j) && daysFrom(j.followUpDate) <= 7;
export const isLate = (j) => j.followUpDate && isOpen(j) && daysFrom(j.followUpDate) <= 0;
