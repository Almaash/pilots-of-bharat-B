import express from 'express';
import {
  createSkill,
  getUserSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/create', upload.single('image'), createSkill);
router.get('/user/:userId', getUserSkills);
router.get('/get/:id', getSkillById);
router.put('/update/:id', upload.single("image"), updateSkill);
router.delete('/delete/:id', deleteSkill);

export default router;
