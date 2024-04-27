import express from 'express';
import bucketController from '../controllers/bucketController.js'

// Validations
import bucketValidation from '../validations/BucketValidations.js';

const router = express.Router()

router.get('/',bucketController.getBucketData)
router.post('/create-bucket',[bucketValidation.createBucketValidation],bucketController.createBucket)
router.post('/add-balls',bucketController.addBalls)


export default router;


