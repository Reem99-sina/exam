const Joi = require("joi");

module.exports.validationsddcomment = {
    body: Joi.object().required().keys({
        Comment_body: Joi.string().min(10).required(),
        Product_id: Joi.string().min(24).max(24),
        Comment_by: Joi.string().min(24).max(24)
    }), params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required()
    })
}
module.exports.validationsreplycomment = {
    body: Joi.object().required().keys({
        Comment_body: Joi.string().min(10).required(),
        Product_id: Joi.string().min(24).max(24),
        Comment_by: Joi.string().min(24).max(24)
    }), query: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required(),
        commentId: Joi.string().min(24).max(24).required()
    })
}
module.exports.validationsupdatecomment = {
    body: Joi.object().required().keys({
        Comment_body: Joi.string().min(10).required(),
        Product_id: Joi.string().min(24).max(24),
        Comment_by: Joi.string().min(24).max(24)
    }), params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required(),
    })
}
module.exports.validationsdeletecomment = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required(),
    })
}
module.exports.validationslikecomment = {
    params: Joi.object().required().keys({
        id: Joi.string().min(24).max(24).required(),
    })
}