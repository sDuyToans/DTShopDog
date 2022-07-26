const Joi = require('joi');

module.exports.dogsSchema = Joi.object({
    dogs: Joi.object({
        name: Joi.string().required(),
        age: Joi.number().min(1).required(),
        type: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().min(1).required(),
        // image: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.discussSchema = Joi.object({
    discuss: Joi.object({
        comment: Joi.string().required(),
    }).required()
});

//so what dogsSchema in joi gonna do ?
//no se dung de yeu cau (required) nhung thong tin input cua dogs[]
//sau do chung ta se dung middleware de check trong cac lenh post,edit,...
//so what the middleware look like?
//here is the example
// const validateDog = (req, res, next) =>{
//     const { error } = dogsSchema.validate(req.body); chech xem thu co error nao trong req.body khong
//     if(error) { neu co error
//         const msg = error.details.map(el => el.message).join(',') thi ta se map error details thanh msg, trong moi error.details co 1 message maybe more chi la chua tim hieu het
//         throw new ExpressError(msg, 400) sau do chung ta throw msg va set statuscode la 400
//     } else {
//     next(); va chung ta se call next 
//     }
// }


