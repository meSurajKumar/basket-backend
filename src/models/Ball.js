import mongoose,{Schema, model} from "mongoose";


const ballSchema = new Schema({
    ballColor : {
        type : String
    },
    ballVolume : {
        type : Number
    }
})

const Ball = model('balls', ballSchema);
export default Ball;