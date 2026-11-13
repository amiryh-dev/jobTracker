import { Router } from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';
import {
  listJobs, getJob, createJob, updateJob, deleteJob,
} from '../controllers/jobController.js';

const router = Router();
router.use(requireAuth); // every jobs route needs a signed-in user

function validId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: 'Application not found.' });
  }
  next();
}

router.get('/', listJobs);                 // GET    /api/jobs
router.post('/', createJob);               // POST   /api/jobs
router.get('/:id', validId, getJob);       // GET    /api/jobs/:id
router.put('/:id', validId, updateJob);    // PUT    /api/jobs/:id
router.delete('/:id', validId, deleteJob); // DELETE /api/jobs/:id

export default router;
