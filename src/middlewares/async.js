// A common function that handle the error in controllers

import { messages } from "../common/apiResponses.js"


export default function(handler){
    return async(req, res, next)=>{
    try{
        await handler(req,res)
    }catch (ex) {
        return res.status(400).send({message : ex.message || messages.SOMETHING_WENT_WRONG})
    }}
}