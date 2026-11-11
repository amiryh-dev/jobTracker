import Job from '../models/Job.js';

const EDITABLE = [
  'company', 'position', 'status', 'appliedDate', 'location', 'salary',
  'interviewDate', 'interviewType', 'followUpDate', 'jobLink', 'contact', 'notes',
];

// Keep only the fields a user is allowed to set
function pickFields(body) {
  const data = {};
  for (const key of EDITABLE) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  if (data.salary === '') data.salary = null;
  return data;
}

// Authorization: every query is filtered by `user: req.userId`,
// so a user can only read or change their own applications.

// GET /api/jobs
export async function listJobs(req, res, next) {
  try {
    const jobs = await Job.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
}

// GET /api/jobs/:id
export async function getJob(req, res, next) {
  try {
    const job = await Job.findOne({ _id: req.params.id, user: req.userId });
    if (!job) return res.status(404).json({ message: 'Application not found.' });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

// POST /api/jobs
export async function createJob(req, res, next) {
  try {
    const job = await Job.create({ ...pickFields(req.body), user: req.userId });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
}

// PUT /api/jobs/:id
export async function updateJob(req, res, next) {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      pickFields(req.body),
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: 'Application not found.' });
    res.json(job);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/jobs/:id
export async function deleteJob(req, res, next) {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!job) return res.status(404).json({ message: 'Application not found.' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
