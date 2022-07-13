const { roles } = require("../../../Middleware/auth");

module.exports.endpoint = {
    addcomment: [roles.admin, roles.user]
}