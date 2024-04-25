import {Schema, model} from 'mongoose';

const bucketSchema = new Schema({
    bucketName : {
        type : String
    },
    bucketVolume : {
        type : Number
    },
    bucketVolumeLeft : {
        type : Number
    },
    ballsData : {
        type : Array,
        default:[]
    }
})

const Bucket = model('buckets' , bucketSchema)
export default Bucket;