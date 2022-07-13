const joi = require("joi");

module.exports.signupvalidation = {
    body: joi.object().required().keys({
        firstName: joi.string().required().pattern(new RegExp(/[a-z]{1,5}$/)),
        lastName: joi.string().required().pattern(new RegExp(/[a-z]{1,5}$/)),
        Email: joi.string().email().required(),
        Password: joi.string().required().pattern(new RegExp(/^[a-z]{3,5}$/)),
        cPassword: joi.string().valid(joi.ref('Password')).required(),
        role: joi.string()
    })
}
module.exports.confirmvalidation = {
    params: joi.object().required().keys({
        token: joi.string().required()
    })
}
module.exports.signinvalidation = {
    body: joi.object().required().keys({
        Email: joi.string().email().required(),
        Password: joi.string().required().pattern(new RegExp(/^[a-z]{3,5}$/)),
    })
}
module.exports.profilevalidation = {
    body: joi.object().required().keys({
        Email: joi.string().email().required(),
        Password: joi.string().required().pattern(new RegExp(/^[a-z]{3,5}$/)),
    })
}
module.exports.deletevalidation = {
    params: joi.object().required().keys({
        id: joi.string().required()
    })
}
module.exports.sendcodevalid = {
    body: joi.object().required().keys({
        Email: joi.string().email().required(),

    })
}
module.exports.forgetPassword = {
    body: joi.object().required().keys({
        Email: joi.string().email().required(),
        code: joi.string().required(),
        Newmpassword: joi.string().required().pattern(new RegExp(/^[a-z]{3,5}$/))
    })
}
module.exports.softDeletevalid = {
    params: joi.object().required().keys({
        id: joi.string().required()
    })

}