const express = require('express')
const router = express.Router();
const postController = require('../controllers/Post.Controller');

router.route("/")
.post(postController.createPost)
.get(postController.getAllPosts)

router.route("/:id")
.get(postController.getPostById)
.patch(postController.updatePost)
.delete(postController.deletePost)

module.exports = router;