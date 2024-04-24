import Basket from "../models/Bucket.js";
import {messages} from '../common/apiResponses.js'


class BasketController{
    constructor(){}

    /**
     * Create Basket
     * @param {basketName , volume}
     * @return json response
     */
    createBasket = async(req, res)=>{
        const {bucketName , volume} = req.body
        const bucketExist = await Basket.findOne({bucketName : bucketName})
        if(bucketExist) {
            await Basket.updateOne({bucketName:bucketName},{bucketName:bucketName , bucketVolume:volume})
            return res.status(200).send({message: messages.BUCKET_UPDATED})
        }
        const basketData = new Basket({
            bucketName, 
            bucketVolume:volume
        })        
        const basketSaved = await basketData.save();
        return res.status(200).send({message: messages.BUCKET_CREATED, data:basketSaved})
    }






}

const basketController = new BasketController();
export default basketController;