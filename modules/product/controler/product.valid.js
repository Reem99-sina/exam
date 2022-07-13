const Joi = require("joi");

module.exports.addproductvalid = {
    body: Joi.object().required().keys({
        Product_title: Joi.string().required(),
        Product_desc: Joi.string().required(),
        Product_price: Joi.string().required()
    })
}
module.exports.updateproductvalid = {
    body: Joi.object().required().keys({
        Product_title: Joi.string(),
        Product_desc: Joi.string(),
        Product_price: Joi.string()
    }), params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}
module.exports.deleteproduct = {
 params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}
module.exports.likeProduct = {
    params: Joi.object().required().keys({
           id: Joi.string().min(24).max(24).required()
       })
   }
   module.exports.wishlistvalidate = {
    params: Joi.object().required().keys({
           id: Joi.string().min(24).max(24).required()
       })
   }
   module.exports.hiddenuservalid = {
    params: Joi.object().required().keys({
           id: Joi.string().min(24).max(24).required()
       })
   }