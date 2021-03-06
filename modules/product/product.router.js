const { auth } = require("../../Middleware/auth")
const { validation } = require("../../Middleware/validation")
const { endPoint } = require("./controler/product.endpoint")
const productservice = require("./controler/product.service")
const validate = require("./controler/product.valid")

const router = require("express").Router()
router.post("/addproduct", auth(endPoint.addproductuser), validation(validate.addproductvalid), productservice.addProduct)
router.patch("/updateProduct/:id", auth(endPoint.updateProduct), validation(validate.updateproductvalid), productservice.productUpdate)
router.delete("/deleteProduct/:id", auth(endPoint.delete), validation(validate.deleteproduct), productservice.deleteproduct)
router.patch("/softdelete/:id", auth(endPoint.delete), validation(validate.deleteproduct), productservice.softDelete)
router.patch("/likeandunlike/:id", auth(endPoint.like), validation(validate.likeProduct), productservice.likeandunlike)
router.patch("/wishlist/:id", auth(endPoint.wishlist), validation(validate.wishlistvalidate), productservice.wishlistproduct)
router.patch("/hiddenuser/:id", auth(endPoint.hiddenuser), validation(validate.hiddenuservalid), productservice.hiddeneduser)
router.get("/productsuser/:CreatedBy", productservice.getproducttospecialuser)
// router.get("/invoiceProduct", productservice.invoiceProducts)
module.exports = router