const commentModel = require("../../../DB/models/comment.model")
const productModel = require("../../../DB/models/porduct.model")
const userModel = require("../../../DB/models/user.model")

module.exports.addcomment = async (req, res) => {
    const { id } = req.params
    const { Comment_body } = req.body
    const user = await userModel.findById(req.user.id)
    if (!user) {
        res.status(400).json({ message: "user not existed" })
    } else {
        const product = await productModel.findById(id)
        if (!product) {
            res.status(400).json({ message: "product not existed" })
        } else {
            const comment = new commentModel({ Comment_body, Product_id: product._id, Comment_by: user._id })
            const savecommet = await comment.save()
            require("../../../app").io.emit("reply", `${savecomment}`)
            const productupdate = await productModel.findByIdAndUpdate(product._id, { $push: { Comments: savecommet._id } })
            res.status(200).json({ message: "comment added", savecommet, productupdate })
        }
    }
}
module.exports.addreplycomment = async (req, res) => {
    const { id, commentId } = req.query
    const { Comment_body } = req.body
    const user = await userModel.findById(req.user.id)
    if (!user) {
        res.status(400).json({ message: "user not existed" })
    } else {
        const product = await productModel.findById(id)
        if (!product) {
            res.status(400).json({ message: "product not existed" })
        } else {
            const findcomment = await commentModel.findOne({ _id: commentId, Product_id: product._id })
            if (!findcomment) {
                res.status(400).json({ message: "comment not existed" })

            } else {
                const comment = new commentModel({ Comment_body, Product_id: product._id, Comment_by: user._id })
                const savecommet = await comment.save()
                const commentupdate = await commentModel.findByIdAndUpdate(findcomment._id, { $push: { Replies: savecommet._id } })
                res.status(200).json({ message: "comment added", savecommet, commentupdate })
            }

        }
    }
}
module.exports.updatecomment = async (req, res) => {
    try {
        const { id } = req.params
        const { Comment_body } = req.body
        const user = await userModel.findById(req.user.id)
        console.log(user._id)
        if (!user) {
            res.status(400).json({ message: "user not existed" })
        } else {
            const comment = await commentModel.findById(id)
            if (!comment) {
                res.status(400).json({ message: "not comment there" })
            } else {
                if (comment.Comment_by != user.id) {
                    res.status(400).json({ message: "allow just the ownercomment there" })
                } else {
                    const commentupdate = await commentModel.findByIdAndUpdate(comment._id, { Comment_body })
                    res.status(200).json({ message: "comment added", commentupdate })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error catch", error })

    }

}
module.exports.deletecomment = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(req.user.id)
        const comment = await commentModel.findById(id)
        if (!user || !comment) {
            res.status(400).json({ message: "user not existed or comment" })
        } else {
            const product = await productModel.findById(comment.Product_id)
            if (comment.Comment_by == user.id || product.CreatedBy == user.id) {
                const deletecomment = await commentModel.findByIdAndDelete(id)
                const deletecommentproduct = await productModel.findByIdAndUpdate(product.id, { $pull: { Comments: comment.id } })
                res.status(200).json({ message: "done deleted", deletecomment, deletecommentproduct })
            } else {
                res.status(400).json({ message: "not user owner or not product owner" })
            }
        }
    } catch (error) {
        res.status(400).json({ message: "error catch", error })
    }
}
module.exports.likeandunlikecomment = async (req, res) => {
    // try {
    const { id } = req.params
    const user = await userModel.findById(req.user.id)
    const comment = await commentModel.findById(id)
    if (!user) {
        res.status(400).json({ message: "in-valid user" })
    } else {
        if (!comment) {
            res.status(400).json({ message: "notproduct found" })
        } else {
            if (!comment.Likes.includes(user.id)) {
                const commentlike = await commentModel.findByIdAndUpdate(id, { $push: { Likes: user.id } })
                res.status(200).json({ message: "done like user", commentlike })

            } else {
                const commentunlike = await commentModel.findByIdAndUpdate(id, { $pull: { Likes: user.id } })
                res.status(200).json({ message: "done unlike user", commentunlike })
            }
        }

    }
    // } catch (error) {
    //     res.status(400).json({ message: "error catch", error })
    // }
}