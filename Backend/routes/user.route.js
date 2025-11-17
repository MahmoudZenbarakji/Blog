const express = require("express")
const router =  express.Router()
const userController = require("../controllers/user.controller")

router
.route("/")
.post(userController.createUser)
.get(userController.getUser)

router
.route("/:id")
.get(userController.getUserById)
.patch(userController.updateUser)


module.exports = router;