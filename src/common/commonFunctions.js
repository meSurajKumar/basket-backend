import Bucket from "../models/Bucket.js";




export const emptyBucket = async (bucketId) => {
    try {
        const bucket = await Bucket.findById(bucketId);
        if (!bucket) {
            console.log(`Bucket with ID ${bucketId} not found.`);
            return false;
        }
        bucket.bucketVolumeLeft = bucket.bucketVolume;
        bucket.ballsData = [];
        await bucket.save();
        console.log(`Bucket with ID ${bucketId} emptied successfully.`);
        return true;
    } catch (error) {
        console.error(`Error emptying bucket with ID ${bucketId}:`, error);
        return false;
    }
};