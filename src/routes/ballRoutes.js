import express from 'express';
import ballController from '../controllers/ballController.js';

/// Vaidations 
import ballValidation from '../validations/BallValidations.js';

const router = express.Router();

router.post('/create-ball',[ballValidation.createBallValidation],ballController.createBall)

export default router;