import Bucket from "../models/Bucket.js";
import Ball from "../models/Ball.js";
import {messages} from '../common/apiResponses.js'


class BasketController{
    constructor(){}

    /**
     * Create Bucket
     * @param {bucketName , volume}
     * @return json response
    */
    createBucket = async(req, res)=>{
        const {bucketName , volume} = req.body
        const bucketExist = await Bucket.findOne({bucketName : bucketName})
        if(bucketExist) {
            await Bucket.updateOne({bucketName:bucketName},{bucketName:bucketName , bucketVolume:volume})
            return res.status(200).send({message: messages.BUCKET_UPDATED})
        }
        const bucketData = new Bucket({
            bucketName, 
            bucketVolume:volume,
            bucketVolumeLeft:volume
        })        
        const bucketSaved = await bucketData.save();
        return res.status(200).send({message: messages.BUCKET_CREATED, data:bucketSaved})
    }

    /**
     * Add balls to bucket
     * @param {[{ballName, ballCounts},{ballName, ballCounts},{ballName, ballCounts}.....]}
     * @return jons response
    */
    addBalls = async (req, res) => {
        try {
            let transformedBallData = [];
            const ballsData = req.body.ballData;
    
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
                    // If the ball with the same name is not found in the bucket, add a new object
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
                    return res.status(400).send({ message: `Ball '${ball.ballName}' couldn't be stored.` });
                }
            }    
            // All balls stored successfully
            return res.status(200).send({ message: messages.BALL_STORED});
        } catch (error) {
            return res.status(500).send({ message: "An error occurred while placing balls in buckets." });
        }
    }

    /**
     *@param{}
     *@return json response 
    */
    getBucketData = async(req, res)=>{
        const bucket = await Bucket.find()
        return res.status(200).send({ message: "Buckets data : ", data:bucket});
    }

}

const basketController = new BasketController();
export default basketController;