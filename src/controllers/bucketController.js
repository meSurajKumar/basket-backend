import Bucket from "../models/Bucket.js";
import BucketData from "../models/BucketData.js";
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
            await Basket.updateOne({bucketName:bucketName},{bucketName:bucketName , bucketVolume:volume})
            return res.status(200).send({message: messages.BUCKET_UPDATED})
        }
        const bucketData = new Bucket({
            bucketName, 
            bucketVolume:volume
        })        
        const bucketSaved = await bucketData.save();
        return res.status(200).send({message: messages.BUCKET_CREATED, data:bucketSaved})
    }

    /**
     * Add balls to bucket
     * @param {[{ballName, ballCounts},{ballName, ballCounts},{ballName, ballCounts}.....]}
     * @return jons response
    */
    addBalls = async(req, res)=>{
        let ballsData = req.body;
        const bucket = await Bucket.find()
        


        return res.status(200).send({message: messages.BUCKET_CREATED, data:ballsData})

    }

}

const basketController = new BasketController();
export default basketController;