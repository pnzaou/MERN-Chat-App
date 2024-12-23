const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if(!token) {
            return res.status(403).json({message: "Accès refusé"})
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if(!decode) {
            return res.status(401).json({message: "Token Invalid"})
        }

        const user = await User.findById(decode.userId).select("-password")
        if(!user) {
            return res.status(404).json({message: "Utilisateur introuvable"})
        }

        req.user = user
        next()

    } catch (error) {
        console.log("Erreur dans auth.middleware", error.message);
        return res.status(500).json({message: "Erreur! Veuillez réessayer"})
    }
}

module.exports = protectRoute