import Ball from "../models/Ball.js";
import Bucket from "../models/Bucket.js";
import {messages} from '../common/apiResponses.js'
import {emptyBucket} from '../common/commonFunctions.js'

// middleware
import asyncMiddleware from '../middlewares/async.js'


class BallController{
    constructor(){}

    /**
     * Create Ball
     * @param {ballColor , ballVolume}
     * @return json response
     */
    createBall = asyncMiddleware(async (req, res) => {
            const { ballColor, ballVolume } = req.body;    
            // Empty all existing buckets
            const buckets = await Bucket.find();
            const emptyPromises = buckets.map(bucket => emptyBucket(bucket._id));
            await Promise.all(emptyPromises);
    
            let ball;
            let message;    
            // Check if the ball already exists
            const existingBall = await Ball.findOne({ ballColor });    
            if (existingBall) {
                // Update the existing ball
                ball = await Ball.findOneAndUpdate(
                    { ballColor },
                    { ballVolume },
                    { new: true }
                );
                message = messages.BALL_UPDATED;
            } else {
                // Create a new ball
                ball = new Ball({
                    ballColor,
                    ballVolume
                });
                await ball.save();
                message = messages.BALL_CREATED;
            }    
            return res.status(200).send({ message, data: ball });
    });

    /**
     *@param{}
     *@return json response 
    */
     getBallData = asyncMiddleware(async(req, res)=>{
        const bucket = await Ball.find()
        return res.status(200).send({ message: messages.BALL_DATA, data:bucket});
    });

}

const ballController = new BallController();
export default ballController;
