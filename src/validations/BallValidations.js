import Joi from 'joi';

class BallValidation {
    constructor(){}


    /**
     * Create Ball Validation
     * @param {req data}
     * @return {true, false}
     */
    createBallValidation = (req, res, next)=>{
        const schema = Joi.object({
            ballColor : Joi.string().required().empty('').messages({
                'any.required' : 'ballColor is required !'
            }),
            ballVolume : Joi.number().required().empty('').messages({
                'any.required' : 'ballVolume is requied !'
            })
        })
        const {error} = schema.validate(req.body)
        if (error) return res.status(400).send({message : error.details[0].message})
        return next()
    }

    
}


const ballValidation = new BallValidation()
export default ballValidation;
