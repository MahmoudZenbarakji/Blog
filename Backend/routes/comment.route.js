const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

router.get("/post/:postId", commentController.getCommentsForPost);

router
  .route("/:id")
  .get(commentController.getCommentById)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment);

router.route('/').post(commentController.createComment);


module.exports = router;

