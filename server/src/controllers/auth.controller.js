const User = require("../models/user.model")
const bcrypt = require("bcryptjs")
const { generateToken } = require("../utils/")
const cloudinary = require("../lib/cloudinary")
const { trusted } = require("mongoose")

const signUp = async (req, res) => {
    const {fullName, email, password} = req.body
    try {
        if(!fullName || !email || !password) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires."})
        }

        if(password.length < 8) {
            return res.status(400).json({ message: "Votre mot de passe doit avoir au moins 8 caractères."})
        }

        const user = await User.findOne({email})

        if (user) {
            return res.status(400).json({message: "Email déjà existant."})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPaswword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPaswword
        })

        generateToken(newUser._id, res)

        return res.status(201).json({message: "Inscription réussie", newUser})

    } catch (error) {
        console.log("Erreur dans auth.controller(signUp)", error.message)
        return res.status(500).json({message: "Erreur ! Veuillez réessayer"})
    }
}

const login = async (req, res) => {
    const {email, password} = req.body
    try {
        if(!email || !password) {
            return res.status(400).json({message: "Tous les champs sont obligatoires"})
        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(401).json({message: "Email ou mot de passe incorrect"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect) {
            return res.status(401).json({message: "Email ou mot de passe incorrect"})
        }

        generateToken(user._id, res)

        return res.status(200).json({message: "Connexion réussie", user})
    } catch (error) {
        console.log("Erreur dans auth.controller(login)", error.message)
        return res.status(500).json({message: "Erreur ! Veuillez réessayer"})
    }
}

const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        return res.status(200).json({message: "Déconnexion réussie."})
    } catch (error) {
        console.log("Erreur dans auth.controller(logout)", error.message)
        return res.status(500).json({message: "Erreur ! Veuillez réessayer"})
    }
}

const updateProfile = async (req, res) => {
    const {profilPic} = req.body
    const userId = req.user._id
    try {
        if(!profilPic) {
            return res.status(400).json({message: "Veuillez choisir une photo"})
        }

        const rep = await cloudinary.uploader.upload(profilPic)
        const updatedUser = await User.findByIdAndUpdate(userId, {profilPic: rep.secure_url}, {new: true})

        return res.status(200).json({message: "Photo de profil mis à jour.", updatedUser})

    } catch (error) {
        console.log("Erreur dans auth.controller(updateProfile)", error.message)
        return res.status(500).json({message: "Erreur ! Veuillez réessayer"})
    }
}

const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        console.log("Erreur dans auth.controller(checkAuth)", error.message);
        return res.status(500).json({message: "Erreur Serveur"})
    }
}

module.exports = {
    signUp,
    login,
    logout,
    updateProfile,
    checkAuth
}