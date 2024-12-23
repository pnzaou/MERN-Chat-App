const express = require("express")
const protectRoute = require("../middleware/auth.middleware")
const { getUsersForSideBar, getMessages, sendMessage } = require("../controllers/message.controller")
const router = express.Router()

router.get("/user", protectRoute, getUsersForSideBar)
router.get("/:id", protectRoute, getMessages)

router.post("/send/:id", protectRoute, sendMessage)

module.exports = router 