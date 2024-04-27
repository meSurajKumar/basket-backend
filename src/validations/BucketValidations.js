import Joi from 'joi';

class BucketValidation {
    constructor(){}


    /**
     * Create Bucket Validation
     * @param {req data}
     * @return {true, false}
     */
    createBucketValidation = (req, res, next)=>{
        const schema = Joi.object({
            bucketName : Joi.string().required().empty('').messages({
                'any.required' : 'bucketName is required !'
            }),
            volume : Joi.number().required().empty('').messages({
                'any.required' : 'volume is requied !'
            })
        })
        const {error} = schema.validate(req.body)
        if (error) return res.status(400).send({message : error.details[0].message})
        return next()
    }


}


const bucketValidation = new BucketValidation()
export default bucketValidation;
