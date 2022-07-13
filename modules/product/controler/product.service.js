const productModel = require("../../../DB/models/porduct.model")
const userModel = require("../../../DB/models/user.model")
const QRCode = require('qrcode');
const commentModel = require("../../../DB/models/comment.model");
const { paginate } = require("../../../services/paginate");
const { createInvoice } = require("../../../services/createInvoice");
const path = require("path");
const server = require("../../../app");

module.exports.addProduct = async (req, res) => {
    // try {
    const user = await userModel.findById(req.user.id)
    if (user) {
        const { Product_title, Product_desc, Product_price } = req.body
        const product = new productModel({ Product_title, Product_desc, Product_price, CreatedBy: user._id })
        const saveProduct = await product.save()
        const userupdate = await userModel.findByIdAndUpdate(user.id, { $push: { WishList: saveProduct.id } })
        const usersocket = await userModel.findById(user.id).select('socketId')
        require("../../../app").io.emit("reply", saveProduct)
        QRCode.toDataURL(`${saveProduct}`, async (err, url) => {
            if (err) {
                res.status(400).json({ message: "QR err" })
            } else {
                const productUpdate = await productModel.findByIdAndUpdate(saveProduct._id, { Qrcode: url })
                res.status(200).json({ message: "done add pproduct", productUpdate, url })
            }
        })
    } else {
        res.status(400).json({ message: "no user has this id" })
    }
    // } catch (error) {
    //     res.status(500).json({ message: "error catch", error })
    // }
}
module.exports.productUpdate = async (req, res) => {
    try {
        const { id } = req.params
        const { Product_title, Product_desc, Product_price } = req.body
        const user = await userModel.findById(req.user.id)

        if (!user) {
            res.status(400).json({ message: "no user has this id" })
        } else {
            if (user.role == "admin") {
                const product = await productModel.findById(id)
                if (!product) {
                    res.status(400).json({ message: "noproduct found" })
                } else {
                    const productupdate = await productModel.findByIdAndUpdate(product._id, { Product_title, Product_desc, Product_price })
                    res.status(200).json({ message: "done update", productupdate })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error", error })

    }

}
module.exports.deleteproduct = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(req.user.id)
        const product = await productModel.findById(id)
        if (user._id == product.CreatedBy || user.role == "admin") {
            const productdelete = await productModel.findByIdAndDelete(id)
            const commentproduct = await commentModel.findOneAndDelete({ Product_id: product.id },)
            res.status(200).json({ message: "done deleted", productdelete })
        } else {
            res.status(400).json({ message: "user not the owner or admin" })
        }
    } catch (error) {
        res.status(400).json({ message: "error catch", error })
    }
}
module.exports.softDelete = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(req.user.id)
        const product = await productModel.findById(id)
        if (!user) {
            res.status(400).json({ message: "in-valid user" })
        } else {
            if (user._id == product.CreatedBy || user.role == "admin") {
                const productdelete = await productModel.findByIdAndUpdate(id, { IsDeleted: true })
                res.status(200).json({ message: "done delete user", productdelete })
            } else {
                res.status(400).json({ message: "not admin user so you cannt delete user" })
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: " user error", error })
    }
}
module.exports.likeandunlike = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(req.user.id)
        const product = await productModel.findById(id)
        if (!user) {
            res.status(400).json({ message: "in-valid user" })
        } else {
            if (!product) {
                res.status(400).json({ message: "notproduct found" })
            } else {
                if (!product.Likes.includes(user._id)) {
                    const productlike = await productModel.findByIdAndUpdate(id, { $push: { Likes: user._id } })
                    res.status(200).json({ message: "done like user", productlike })

                } else {
                    const productlike = await productModel.findByIdAndUpdate(id, { $pull: { Likes: user._id } })
                    res.status(200).json({ message: "done unlike user", productlike })
                }
            }

        }
    } catch (error) {
        res.status(500).json({ message: "error catch", error })

    }
}
module.exports.wishlistproduct = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(req.user.id)
        const product = await productModel.findById(id)
        if (!user) {
            res.status(400).json({ message: "in-valid user" })
        } else {
            if (!product) {
                res.status(400).json({ message: "notproduct found" })
            } else {
                if (!user.WishList.includes(product._id)) {

                    const userwishlist = await userModel.findByIdAndUpdate(user._id, { $push: { WishList: product.id } })

                    res.status(200).json({ message: "done wishlist user", userwishlist })
                } else {
                    res.status(400).json({ message: "user have wishlist already" })
                }
            }

        }
    } catch (error) {
        res.status(500).json({ message: "error catch ", error })
    }
}
module.exports.hiddeneduser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(req.user.id)
        if (!user) {
            res.status(400).json({ message: "in-valid user" })
        } else {
            const productuser = await productModel.findByIdAndUpdate(id, { Hidden: true })
            res.status(200).json({ message: "done hidden user", productuser })
        }

    } catch (error) {
        res.status(500).json({ message: "error catch ", error })
    }
}
module.exports.invoiceProducts = async (req, res) => {
    try {
        let now = new Date();
        const page = 0
        const size = 2
        const { limit, skip } = paginate(page, size)
        let startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const product = await productModel.find({ createdAt: { $gte: startOfToday } }).select('Product_title Product_desc Product_price createdAt').limit(limit).skip(skip)
        const invoice = {
            shipping: {
                name: "products",
                address: "1234 Main Street",
                city: "San Francisco",
                state: "CA",
                country: "US",
                postal_code: 94111
            },
            items: product,
            subtotal: 8000,
            paid: 0,
            invoice_nr: 1234
        };
        createInvoice(invoice, path.join(__dirname, '../../../uploads/PDF/invoice.pdf'))
    } catch (error) {
        res.status(500).json({ message: "error catch ", error })
    }
}
module.exports.getproducttospecialuser = async (req, res) => {
    const { CreatedBy } = req.params;
    const products = await productModel.find({ CreatedBy: CreatedBy })
    res.json({ message: "done", products })
}