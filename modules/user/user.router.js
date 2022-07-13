const { auth } = require("../../Middleware/auth")
const { validation } = require("../../Middleware/validation")
const { myMulter, filetype } = require("../../services/multer")
const { endPoint } = require("./controler/user.endpoint")
const userservice = require("./controler/user.service")
const validationuser = require("./controler/user.validation")
const router = require("express").Router()
router.post("/signup", validation(validationuser.signupvalidation), userservice.signup)
router.get("/confirmEmail/:token", validation(validationuser.confirmvalidation), userservice.confirm)
router.post("/signin", validation(validationuser.signinvalidation), userservice.signin)
router.patch("/updateProfile", auth(endPoint.updateProfile), validation(validationuser.profilevalidation), userservice.profile)
router.delete("/deleteUser/:id", auth(endPoint.deleteUser), validation(validationuser.deletevalidation), userservice.profiledelete)
router.patch("/updatePicture", auth(endPoint.updatePicture), myMulter("/picture", filetype.Image).array("image", 5), userservice.addPicture)
router.patch("/updatecoverPicture", auth(endPoint.updatePicture), myMulter("/single", filetype.Image).single("image"), userservice.addcoverPicture)
router.post("/sendcode", validation(validationuser.sendcodevalid), userservice.sendcode)
router.post("/forgetPassword", validation(validationuser.forgetPassword), userservice.forgetpassword)
router.patch("/softDelete/:id", auth(endPoint.softdelet), validation(validationuser.softDeletevalid), userservice.softDelete)
router.get("/getallproduct", userservice.getallproductuser)
// router.get("/sendemailtoadmin", userservice.sendemailtoadmin)
module.exports = router



