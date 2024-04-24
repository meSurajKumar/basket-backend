import {Schema, model} from 'mongoose';

const bucketSchema = new Schema({
    bucketName : {
        type : String
    },
    bucketVolume : {
        type : Number
    }
})

const Bucket = model('bucket' , bucketSchema)
export default Bucket;