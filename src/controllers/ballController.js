import Ball from "../models/Ball.js";
import {messages} from '../common/apiResponses.js'



class BallController{
    constructor(){}

    /**
     * Create Ball
     * @param {ballColor , ballVolume}
     * @return json response
     */
    createBall = async(req, res)=>{
        const {ballColor , ballVolume} = req.body;
        const ballExists = await Ball.findOne({ballColor:ballColor})
        if(ballExists){
            await Ball.updateOne({ballColor:ballColor},{ballColor:ballColor,ballVolume:ballVolume })
            return res.status(200).send({message : messages.BALL_UPDATED})
        }
        const ballData = new Ball({
            ballColor, ballVolume
        })
        const ballSaved = await ballData.save()
        return res.status(200).send({message : messages.BALL_CREATED, data : ballSaved})
    }



}

const ballController = new BallController();
export default ballController;
