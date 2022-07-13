
const { roles } = require("../../../Middleware/auth");

module.exports.endPoint = {
    addproductuser: [roles.admin, roles.user],
    updateProduct: [roles.admin],
    delete: [roles.admin, roles.user],
    like: [roles.admin, roles.user],
    wishlist:[roles.admin, roles.user],
    hiddenuser:[roles.admin,roles.user]
}