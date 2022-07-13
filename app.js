const express = require('express');
const { connectdb } = require('./DB/connectdb')
const Routercollection = require("./modules/router")
const cors = require("cors")
const app = express()
const path = require("path")
const userModel = require('./DB/models/user.model')
const schedule = require('node-schedule');
const { sendemailtoadmin } = require('./modules/user/controler/user.service')
const { invoiceProducts } = require('./modules/product/controler/product.service')
require("dotenv").config()
app.use(cors())
app.use(express.json())
app.use('/api/v1/uploads', express.static(path.join(__dirname, './uploads')))
app.use("/api/v1/user", Routercollection.userRouter)
app.use("/api/v1/product", Routercollection.productRouter)
app.use("/api/v1/comment", Routercollection.commentRouter)
connectdb()

app.get("/", (req, res) => res.json("welcome"))
const server = app.listen(process.env.PORT, () => {
    console.log(`server is runnin on port`);
})
const io = require("socket.io")(server, {
    cors: "*"
})
schedule.scheduleJob({ second: 59, minute: 59, hour: 23 }, function () {
    invoiceProducts()
    sendemailtoadmin()
});
io.on('connection', function (socket) {
    console.log(socket.id)
    io.emit("socketId", socket.id)
    socket.on("updateSocketId", async (data) => {
        await userModel.findByIdAndUpdate(data, { socketId: socket.id })
    })
    socket.on("privteMessage", (data) => {
        console.log(data)

        socket.broadcast.emit('result', { message: 'Done', data })
        // socket.to(data.destID).emit('reply', 'messageRecived') // send to specific socket id
        // io.to(data.destID).emit('reply', 'messageRecived')// send to specific socket id
        // socket.except(data.destID).emit('reply', {message:'Done' , data})// send to all except specific socket id and sender id
        // send to all except specific socket id
    })
});
exports.io = io