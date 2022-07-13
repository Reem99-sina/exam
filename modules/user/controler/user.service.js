const jwt = require("jsonwebtoken")
const userModel = require("../../../DB/models/user.model")
const sendEmail = require("../../../services/sendEmail")
const bcrypt = require("bcrypt")
const path = require("path")
const { paginate } = require("../../../services/paginate")

module.exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, Email, Password, role } = req.body
        const user = new userModel({ firstName, lastName, Email, Password, role })
        const saveUser = await user.save()
        const token = jwt.sign({ id: saveUser._id }, process.env.jwtemail, { expiresIn: '24h' })
        const URL = `${process.env.domain}/api/v1/user/confirmEmail/${token}`
        const message = `<a href=${URL}>confirm email plz</a>`
        await sendEmail(saveUser.Email, message)
        res.status(201).json({ message: "done signup check email" })
    } catch (error) {
        res.status(500).json({ message: "error catch", error })
    }
}
module.exports.confirm = async (req, res) => {
    try {
        const { token } = req.params
        if (!token) {
            res.status(400).json({ message: "token required" })
        } else {
            const decoded = jwt.verify(token, process.env.jwtemail)
            if (!decoded) {
                res.status(400).json({ message: "in valid token " })
            } else {
                const user = await userModel.findById(decoded.id)
                if (!user) {
                    res.status(400).json({ message: "no user has this id" })
                } else {
                    const userupdate = await userModel.findByIdAndUpdate(user._id, { Confirmed: true })
                    res.status(200).json({ message: "done updateuser", userupdate })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error catch", error })
    }
}
module.exports.signin = async (req, res) => {
    try {
        const { Email, Password } = req.body

        const user = await userModel.findOne({ Email })
        if (!user) {
            res.status(400).json({ message: "user not existed" })
        } else {
            if (!user.Confirmed) {
                res.status(400).json({ message: "u should confirm first email" })
            } else {
                if (user.Blocked) {
                    res.status(400).json({ message: "admin block you" })
                } else {
                    if (user.IsDeleted) {
                        res.status(400).json({ message: "user was deleted" })
                    } else {
                        const match = await bcrypt.compare(Password, user.Password)
                        if (!match) {
                            res.status(400).json({ message: "password error" })
                        } else {
                            const token = jwt.sign({ id: user._id, isLogged: true }, process.env.jwtauth, { expiresIn: "24h" })
                            if (!token) {
                                res.status(400).json({ message: "token error" })
                            } else {
                                res.status(200).json({ message: "done signin", token })

                            }
                        }

                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error catch", error })
    }
}
module.exports.profile = async (req, res) => {
    try {
        const { Email, Password } = req.body
        const user = await userModel.findById(req.user.id)
        if (!user) {
            res.status(400).json({ message: "user not existed" })
        } else {
            if (Email == user.Email) {
                res.status(400).json({ message: "same email  you have" })
            } else {
                const match = await bcrypt.compare(Password, user.Password)
                if (match) {
                    res.status(400).json({ message: "same password  you have" })
                } else {
                    const passworduser = await bcrypt.hash(Password, Number(process.env.saltsofround))
                    const userUpdate = await userModel.findByIdAndUpdate(user._id, { Email, Password: passworduser })
                    const token = jwt.sign({ id: userUpdate._id }, process.env.jwtemail, { expiresIn: '24h' })
                    const URL = `${req.protocol}://${req.headers.host}/api/v1/user/confirmEmail/${token}`
                    const message = `<a href=${URL}>confirm email plz</a>`
                    sendEmail(userUpdate.Email, message)
                    res.status(201).json({ message: "done signup check email", userUpdate })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: "error catch", error })

    }
}
module.exports.profiledelete = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(req.user.id)
        if (user._id == id || user.role == "admin") {
            const user = await userModel.findByIdAndDelete(id)
            res.status(200).json({ message: "done deleted", user })
        } else {
            res.status(400).json({ message: "user not the owner" })
        }
    } catch (error) {
        res.status(400).json({ message: "error catch", error })
    }
}
module.exports.addPicture = async (req, res) => {
    try {
        if (req.imagevalidtype) {
            res.status(400).json({ message: "in-valid image" })
        } else {
            const imageUrl = []
            req.files.forEach(file => {
                imageUrl.push(`${req.destination}/${file.filename}`)
            });
            const user = await userModel.findByIdAndUpdate(req.user.id, { Profile_picture: imageUrl }, { new: true })
            res.status(200).json({ message: "success image", files: req.files, user })
        }
    } catch (error) {
        res.status(400).json({ message: "error image", error })
    }
}
module.exports.addcoverPicture = async (req, res) => {
    try {
        if (req.imagevalidtype) {
            res.status(400).json({ message: "in-valid image" })
        } else {
            if (req.file) {
                const imageUrl = `${req.destination}/${req.file.filename}`
                const user = await userModel.findByIdAndUpdate(req.user.id, { Cover_pictures: imageUrl })
                res.status(200).json({ message: "success image", file: req.file, user })
            } else {
                res.status(200).json({ message: "it is single image" })
            }
        }
    } catch (error) {
        res.status(400).json({ message: "error image", error })
    }
}
module.exports.sendcode = async (req, res) => {
    try {
        const { Email } = req.body
        const user = await userModel.findOne({ Email })
        if (!user) {
            res.status(400).json({ message: "in-valid user" })
        } else {
            const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000) //4589
            const updateuser = await userModel.findByIdAndUpdate(user._id, { code })
            await sendEmail(user.Email, `you need code to reset password:${code}`)
            res.status(200).json({ message: "in-valid user", code })
        }
    } catch (error) {
        res.status(500).json({ message: " user error", error })
    }
}
module.exports.forgetpassword = async (req, res) => {
    try {
        const { Email, code, Newmpassword } = req.body
        const user = await userModel.findOne({ Email })
        if (!user) {
            res.status(400).json({ message: "in-valid user" })
        } else {
            if (user.code != code) {
                res.status(400).json({ message: "user code error" })
            } else {
                const hashnew = await bcrypt.hash(Newmpassword, Number(process.env.saltsofround))
                const updateuser = await userModel.findByIdAndUpdate(user._id, { Password: hashnew })
                res.status(200).json({ message: "in-valid user", code })
            }
        }
    } catch (error) {
        res.status(500).json({ message: " user error", error })
    }
}
module.exports.softDelete = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(req.user.id)
        if (!user) {
            res.status(400).json({ message: "in-valid user" })
        } else {
            if (user.role != "admin") {
                res.status(400).json({ message: "not admin user so you cannt delete user" })
            } else {
                const userdelete = await userModel.findByIdAndUpdate(id, { IsDeleted: true })
                res.status(200).json({ message: "done delete user", userdelete })
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: " user error", error })
    }
}
module.exports.getallproductuser = async (req, res) => {
    try {
        const { page, size } = req.query
        const { limit, skip } = paginate(page, size)
        const users = await userModel.find({}).limit(limit).skip(skip).populate([{
            path: "WishList",
            populate: ([{
                path: "Comments Likes",
                // populate: ([{
                //     path: "Comment_by Product_id Replies Likes"
                // }])
            }])
        }])
        const result = []
        users.forEach((user) => {
            if (!user.Blocked && !user.IsDeleted) {
                result.push(user)
            }
        })
        res.json({ message: "done", result })
    } catch (error) {
        res.status(500).json({ message: " user error", error })
    }
}
module.exports.sendemailtoadmin = async (req, res) => {
    const pdfproduct = `${process.env.domain}/api/v1/uploads/PDF/invoice.pdf`
    const usersadmin = await userModel.find({ role: "admin" })
    usersadmin.forEach(async (user) => {
        await sendEmail(user.Email, `<a href=${pdfproduct}>products pdf today</a>`)
    })
}