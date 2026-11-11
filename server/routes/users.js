import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getProfile, updateProfile, deleteProfile } from '../controllers/userController.js';

const router = Router();
router.use(requireAuth);

router.get('/me', getProfile);       // GET    /api/users/me
router.put('/me', updateProfile);    // PUT    /api/users/me
router.delete('/me', deleteProfile); // DELETE /api/users/me

export default router;
