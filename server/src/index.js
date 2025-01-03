const express = require("express")
require("dotenv").config()
const cookieParser = require("cookie-parser")
const cors = require("cors")
const connectDB = require("./lib/db")
const authRoutes = require("./routes/auth.route")
const messageRoutes = require("./routes/message.route")
const { app, server } = require("./lib/socket")

const PORT = process.env.PORT

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
    }))
    .use(express.json({limit:'10mb'}))
    .use(cookieParser())
    .use("/api/auth", authRoutes)
    .use("/api/message", messageRoutes)

server.listen(PORT, () => {
    console.log(`Server: http://localhsot:${PORT}`);
    connectDB()
})