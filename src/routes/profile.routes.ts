import { Router } from 'express';
import {
  createProfile,
  getProfile,
  getProfiles,
  deleteProfile,
} from '../controllers/profile.controller.js';

const router = Router();

router.post('/', createProfile);
router.get('/', getProfiles);
router.get('/:id', getProfile);
router.delete('/:id', deleteProfile);

export default router;
