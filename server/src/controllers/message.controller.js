const User = require("../models/user.model")
const Message = require("../models/message.model")
const cloudinary = require("../lib/cloudinary")
const { getReceiverSocketId, io } = require("../lib/socket")

const getUsersForSideBar = async (req, res) => {
    const loggedInUserId = req.user._id
    try {
        const fliterdUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password")

        return res.status(200).json(fliterdUsers)
    } catch (error) {
        console.log("Erreur dans message.controller(getUsersForSideBar)", error.message);
        return res.status(500).json({message: "Erreur Serveur"})
    }
}

const getMessages = async (req, res) => {
    const userAuthId = req.user._id
    const {id: userToChatId} = req.params
    try {
        const messages = await Message.find({
            $or:[
                {senderId: userAuthId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: userAuthId}
            ]
        })

        return res.status(200).json(messages)
    } catch (error) {
        console.log("Erreur dans message.controller(getMessages)", error.message);
        return res.status(500).json({message: "Erreur Serveur"})
    }
}

const sendMessage = async (req, res) => {
    const {text, image} = req.body
    const senderId = req.user._id
    const {id: receiverId} = req.params
    try {
        if(!text && !image) {
            return res.status(400).json({message: "Le message doit contenir au moins une image ou du texte"})
        }
        let imageUrl
        if(image) {
            const rep = await cloudinary.uploader.upload(image)
            imageUrl = rep.secure_url
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId) {
           io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        return res.status(201).json({message: "Message envoyé", newMessage})
        
    } catch (error) {
        console.log("Erreur dans message.controller(sendMessage)", error.message);
        return res.status(500).json({message: "Erreur lors de l'envoi! Veuillez réessayer."})
    }
}

module.exports = {
    getUsersForSideBar,
    getMessages,
    sendMessage
}