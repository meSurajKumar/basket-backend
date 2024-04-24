import express from 'express';
import basketController from '../controllers/basketController.js'

const router = express.Router()

router.post('/create-basket',basketController.createBasket)


export default router;


