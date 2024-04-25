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
            let ballsVolumeData = []
            let totalVolume=0;
            const ballsData = req.body.ballData;
            
            for(let i=0;i<ballsData.length;i++){
                let ballName = ballsData[i].ballName
                let ballcount = ballsData[i].ballCounts
                const balls = await Ball.findOne({ballColor:ballName}).select('-_id -__v');
                ballsVolumeData.push({'ballColor' : balls.ballColor , volumeOccupy :balls.ballVolume* ballcount})
                console.log('ballsVolumeData :: ',ballsVolumeData)              
                totalVolume = totalVolume + balls.ballVolume* ballcount
            }
            
            // Sort buckets by available volume in ascending order
            const buckets = await Bucket.find().sort({ bucketVolumeLeft: 1 });

            let ballsPlaced = 0;
            for (const bucket of buckets) {
                if (totalVolume === 0) break; // All balls placed, exit loop
                const spaceLeft = bucket.bucketVolumeLeft;
                console.log('sapce let ::: ' , spaceLeft)
                if (spaceLeft > 0) {
                    const volumeToAdd = Math.min(spaceLeft, totalVolume);
                    // Update BucketData with new ball data
                    bucket.ballsData.push(...ballsVolumeData.map(ball => ({ ballColor: ball.ballColor, ballCounts: ball.volumeOccupy })));
                    bucket.bucketVolumeLeft -= volumeToAdd;
                    await bucket.save();
                    totalVolume -= volumeToAdd;
                    ballsPlaced += volumeToAdd;
                }
            }

            if (ballsPlaced === 0) {
                return res.status(400).send({ message: "No balls were placed in any bucket." });
            }
            return res.status(200).send({ message: `${ballsPlaced} volume of balls were placed in buckets successfully.` });   
    
        } catch (error) {
            console.error("Error in addBalls method:", error);
            return res.status(500).send({ message: "An error occurred while placing balls in buckets." });
        }
    }

}

const basketController = new BasketController();
export default basketController;