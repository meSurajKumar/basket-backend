import Bucket from "../models/Bucket.js";
import Ball from "../models/Ball.js";
import {messages} from '../common/apiResponses.js'
import {emptyBucket} from '../common/commonFunctions.js'

// middleware
import asyncMiddleware from '../middlewares/async.js'


class BasketController{
    constructor(){}

    /**
     * Create Bucket
     * @param {bucketName , volume}
     * @return json response
    */
    createBucket = asyncMiddleware(async (req, res) => {
            const { bucketName, volume } = req.body;    
            // Empty all existing buckets
            const buckets = await Bucket.find();
            const emptyPromises = buckets.map(bucket => emptyBucket(bucket._id));
            await Promise.all(emptyPromises);
    
            let bucket;
            let message;    
            // Check if the bucket already exists
            const existingBucket = await Bucket.findOne({ bucketName });    
            if (existingBucket) {
                // Update the existing bucket
                bucket = await Bucket.findOneAndUpdate(
                    { bucketName },
                    { bucketVolume: volume },
                    { new: true }
                );
                message = messages.BUCKET_UPDATED;
            } else {
                // Create a new bucket
                bucket = new Bucket({
                    bucketName,
                    bucketVolume: volume,
                    bucketVolumeLeft: volume,
                    ballsData: []
                });
                await bucket.save();
                message = messages.BUCKET_CREATED;
            }    
            return res.status(200).send({ message, data: bucket });
    });

    /**
     * Add balls to bucket
     * @param {[{ballName, ballCounts},{ballName, ballCounts},{ballName, ballCounts}.....]}
     * @return jons response
    */
    addBalls = asyncMiddleware(async (req, res) => {
            let transformedBallData = [];
            const ballsData = req.body.ballData;
            const buckets = await Bucket.find();
    
            if (buckets.length == 0) return res.status(400).send({ message: messages.CREATE_BUCKET_FIRST });
    
            // Transform ballData array to ensure each ball count is represented as a separate object
            for (const ball of ballsData) {
                for (let i = 0; i < ball.ballCounts; i++) {
                    transformedBallData.push({
                        ballName: ball.ballName,
                        ballCounts: 1
                    });
                }
            }    
            // Now transformedBallData contains individual balls with count 1 each    
            // Array to store the names of balls that couldn't be stored
            let ballsNotStored = [];
            let totalVolumeNotStored = 0;
    
            // Iterate through each ball and place it in a bucket
            for (const ball of transformedBallData) {
                let ballStored = false;
    
                // Fetch the volume of the ball from the database
                const ballData = await Ball.findOne({ ballColor: ball.ballName });
                const ballVolume = ballData.ballVolume;
    
                // Find a bucket with enough space to store the ball
                const bucket = await Bucket.findOneAndUpdate(
                    { bucketVolumeLeft: { $gte: ballVolume }, "ballsData.ballName": ball.ballName },
                    { $inc: { "ballsData.$.ballCounts": 1, bucketVolumeLeft: -ballVolume } },
                    { new: true }
                );
    
                if (!bucket) {
                    // If the ball with the same name is not found in the bucket, add it to the list
                    const newBucket = await Bucket.findOneAndUpdate(
                        { bucketVolumeLeft: { $gte: ballVolume } },
                        { $push: { ballsData: { ballName: ball.ballName, ballCounts: 1 } }, $inc: { bucketVolumeLeft: -ballVolume } },
                        { sort: { bucketVolumeLeft: 1 }, new: true }
                    );
    
                    if (newBucket) {
                        ballStored = true;
                        console.log(`Ball '${ball.ballName}' stored in new bucket '${newBucket.bucketName}'.`);
                    }
                } else {
                    ballStored = true;
                    console.log(`Ball '${ball.ballName}' added to existing bucket '${bucket.bucketName}'.`);
                }
    
                if (!ballStored) {
                    // Handle the case where the ball couldn't be stored in any bucket
                    console.log(`Ball '${ball.ballName}' couldn't be stored.`);
                    // If the ball couldn't be stored, add it to the ballsNotStored array
                    ballsNotStored.push(ball.ballName);
                    totalVolumeNotStored += ballVolume;
                }
            }
    
            if (ballsNotStored.length > 0) {
                // Calculate the count of each type of ball that couldn't be stored
                let message = "Some balls couldn't be stored in buckets, return them to shop. ";
    
                // Get the minimum number of buckets required to store the balls that couldn't be placed
                const minBucketsRequired = Math.ceil(totalVolumeNotStored / Math.max(...buckets.map(bucket => bucket.bucketVolume)));
    
                let ballCounts = {};
                for (const ballName of ballsNotStored) {
                    if (!ballCounts[ballName]) {
                        ballCounts[ballName] = 1;
                    } else {
                        ballCounts[ballName]++;
                    }
                }
    
                // Construct the message with ball counts and the minimum number of buckets required
                for (const [ballName, count] of Object.entries(ballCounts)) {
                    message += `${count} ${ballName} ball `;
                }
    
                message += `Minimum ${minBucketsRequired} buckets required to store the remaining balls.`;
    
                return res.status(400).send({ message });
            } else {
                // All balls stored successfully
                return res.status(200).send({ message: messages.BALL_STORED });
            }        
    });
    

    /**
     *@param{}
     *@return json response 
    */
    getBucketData = asyncMiddleware(async (req, res) => {
        const buckets = await Bucket.find();    
            // Transform the bucket data
            const transformedBuckets = buckets.map(bucket => {
                let bucketDataString;
                if (bucket.ballsData.length === 0) {
                    bucketDataString = "No balls";
                } else {
                    bucketDataString = bucket.ballsData.map(ball => `${ball.ballCounts} ${ball.ballName} ball`).join(', ');
                }
                return {
                    bucketName: bucket.bucketName,
                    bucketData: bucketDataString
                };
            });
    
            // Check if all buckets have no data
            const allEmpty = transformedBuckets.every(bucket => bucket.bucketData === "No balls");
            const message = allEmpty ? "Buckets has no data" : "Buckets data";
    
            return res.status(200).json({ message: message, data: transformedBuckets });
    });

}

const basketController = new BasketController();
export default basketController;