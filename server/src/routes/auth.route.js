const express = require("express")
const { signUp, login, logout, updateProfile, checkAuth } = require("../controllers/auth.controller")
const protectRoute = require("../middleware/auth.middleware")
const router = express.Router()

router.post("/signup", signUp)
router.post("/login", login)
router.post("/logout", logout)

router.put("/update-profile", protectRoute, updateProfile)

router.get("/check", protectRoute, checkAuth)

module.exports = router