const mongoose = require("mongoose")
const commentSchema = mongoose.Schema({
    Comment_body: String,
    Comment_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    Product_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    Replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    Likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
})
const commentModel = mongoose.model("comment", commentSchema)
module.exports = commentModel