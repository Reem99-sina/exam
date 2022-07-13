const { auth } = require("../../Middleware/auth")
const { validation } = require("../../Middleware/validation")
const { endpoint } = require("./controler/comment.endpoint")
const commentservice = require("./controler/comment.service")
const validatecomment = require("./controler/comment.valid")

const router = require("express").Router()
router.post("/addcomment/:id", auth(endpoint.addcomment), validation(validatecomment.validationsddcomment), commentservice.addcomment)
router.post("/addreply", auth(endpoint.addcomment), validation(validatecomment.validationsreplycomment), commentservice.addreplycomment)
router.patch("/updatecomment/:id", auth(endpoint.addcomment), validation(validatecomment.validationsupdatecomment), commentservice.updatecomment)
router.delete("/deletecomment/:id", auth(endpoint.addcomment), validation(validatecomment.validationsdeletecomment), commentservice.deletecomment)
router.patch("/likeandunlikecomment/:id", auth(endpoint.addcomment), validation(validatecomment.validationslikecomment), commentservice.likeandunlikecomment)

module.exports = router