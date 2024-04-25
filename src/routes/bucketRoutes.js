import express from 'express';
import bucketController from '../controllers/bucketController.js'

const router = express.Router()

router.get('/',bucketController.getBucketData)
router.post('/create-bucket',bucketController.createBucket)
router.post('/add-balls',bucketController.addBalls)


export default router;


