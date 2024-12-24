const {Server} = require("socket.io")
const http = require("http")
const express = require("express")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId]
}

//liste des utilisateurs connectés
const userSocketMap = {} //{userId: socketId}

io.on("connection", (socket) => {
    console.log("Utilisateur connecté", socket.id)

    //récupere l'id de l'utilisateur connecté depuis le clinet
    const userId = socket.handshake.query.userId
    if(userId) {
        //on ajoute l'id de l'utlisateur connecté dans la liste des users connectés
        userSocketMap[userId] = socket.id
    }

    //io.emit() pour envoyer un evennement à tous les clients connectés ici la liste des utilisateurs connectés
    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("Utilisateur déconnecté", socket.id)

        //on ajoute l'id de l'utlisateur connecté dans la liste des users connectés
        delete userSocketMap[userId]

        //on envoie la nouvelle liste aux client connectés
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})


module.exports = { io, app, server, getReceiverSocketId }