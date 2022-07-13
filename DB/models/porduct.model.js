const mongoose = require("mongoose")
const productSchema = mongoose.Schema({
    Product_title: String,
    Product_desc: String,
    Product_price: String,
    Likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    Hidden: { type: Boolean, default: "false" },
    IsDeleted: { type: Boolean, default: "false" },
    Comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    WishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    Qrcode: { type: String }
}, {
    timestamps: true
})
productSchema.pre("findOneAndUpdate", async function (next) {
    const version = await this.model.findOne(this.getQuery()).select("__v")
    this.set({ __v: version.__v + 1 })
    next()
})
// productSchema.post("save", async function (next) {

// })
const productModel = mongoose.model("product", productSchema)
module.exports = productModel