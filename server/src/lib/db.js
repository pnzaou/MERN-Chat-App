const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const rep = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connecté: ${rep.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error:", error)
    }
}

module.exports = connectDB