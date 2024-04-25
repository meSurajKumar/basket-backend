import mongoose, {Schema, model} from "mongoose";

const bucketDataSchema = new Schema({
    bucketId:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'buckets'
    },
    ballsData : {
        type : Array,
        default:[]
    }
})

const BucketData = model('bucketDatas' , bucketDataSchema);
export default BucketData;