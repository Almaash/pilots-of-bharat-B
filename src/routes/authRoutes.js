import express from 'express';
import { createOrFindUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/google', createOrFindUser);

export default router;
