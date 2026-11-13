import { Router } from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

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
  if (data.salary === '' ) data.salary = null;
  return data;
}

function validId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Application not found.' });
  }
  next();
}

// GET /api/jobs
router.get('/', async (req, res, next) => {
  try {
    const jobs = await Job.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

// POST /api/jobs
router.post('/', async (req, res, next) => {
  try {
    const job = await Job.create({ ...pickFields(req.body), user: req.userId });
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
});

// PUT /api/jobs/:id
router.put('/:id', validId, async (req, res, next) => {
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
});

// DELETE /api/jobs/:id
router.delete('/:id', validId, async (req, res, next) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!job) return res.status(404).json({ message: 'Application not found.' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
