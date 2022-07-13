const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    Email: {
        type: String,
        unique: true,
        required: true
    },
    Password: {
        type: String,
        required: true
    }, Profile_picture: Array,
    Cover_pictures: String,
    Qr_code: String,
    Confirmed: { type: Boolean, default: false },
    Blocked: { type: Boolean, default: false },
    WishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    IsDeleted: { type: Boolean, default: false },
    role: { type: String, default: "user" },
    code: String,
     socketId: String
}, {
    timestamps: true
})
userSchema.pre("save", async function (next) {
    this.Password = await bcrypt.hash(this.Password, Number(process.env.saltsofround))
    next()
})
userSchema.pre("findOneAndUpdate", async function (next) {
    const version = await this.model.findOne(this.getQuery()).select("__v")
    this.set({ __v: version.__v + 1 })
    next()
})
const userModel = mongoose.model("user", userSchema)
module.exports = userModel