import express from 'express';
import ballController from '../controllers/ballController.js';

const router = express.Router();

router.post('/create-ball', ballController.createBall)

export default router;