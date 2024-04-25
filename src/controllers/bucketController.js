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
            console.log("Transformed Ball Data:", transformedBallData);
    
            // Iterate through each ball and place it in a bucket
            for (const ball of transformedBallData) {
                let ballStored = false;
    
                // Fetch the volume of the ball from the database
                const ballData = await Ball.findOne({ ballColor: ball.ballName });
                const ballVolume = ballData.ballVolume;
    
                // Find a bucket with enough space to store the ball
                const bucket = await Bucket.findOneAndUpdate(
                    { bucketVolumeLeft: { $gte: ballVolume } },
                    { $push: { ballsData: { ballName: ball.ballName, ballCounts: 1 } }, $inc: { bucketVolumeLeft: -ballVolume } },
                    { sort: { bucketVolumeLeft: 1 }, new: true }
                );
    
                if (bucket) {
                    ballStored = true;
                    console.log(`Ball '${ball.ballName}' stored in bucket '${bucket.bucketName}'.`);
                } else {
                    console.log(`No bucket available to store ball '${ball.ballName}'.`);
                }
    
                if (!ballStored) {
                    // Handle the case where the ball couldn't be stored in any bucket
                    return res.status(400).send({ message: `Ball '${ball.ballName}' couldn't be stored.` });
                }
            }
    
            // All balls stored successfully
            return res.status(200).send({ message: "All balls stored successfully in buckets." });
        } catch (error) {
            console.error("Error in addBalls method:", error);
            return res.status(500).send({ message: "An error occurred while placing balls in buckets." });
        }
    }

}

const basketController = new BasketController();
export default basketController;