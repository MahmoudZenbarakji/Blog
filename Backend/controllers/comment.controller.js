const Comment = require("../models/comment.model"); 
const Post = require('../models/post.model');    
const mongoose = require('mongoose');

exports.createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content) {
      return res.status(400).json({
        status: 'fail',
        message: 'postId and content are required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid postId'
      });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found'
      });
    }

    const userId = req.user._id;

    const comment = await Comment.create({
      postId,
      userId,
      content
    });

    return res.status(201).json({
      status: 'success',
      data: comment
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Server Error'
    });
  }
};



exports.getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid postId'
      });
    }

    // Fetch comments with populated user info
    const comments = await Comment.find({ postId })
      .populate("userId", "name username email")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    console.log("Comments fetched:", comments);

    return res.status(200).json({
      status: 'success',
      results: comments.length,
      data: comments
    });
  } catch (error) {
    console.error("Error in getCommentsForPost:", error);
    return res.status(500).json({
      status: 'error',
      message: 'Server Error'
    });
  }
};


exports.getCommentById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid ID'
      });
    }

    const comment = await Comment.findById(postId)
      .populate("userId", "name username");

    if (!comment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Comment not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: comment
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server Error'
    });
  }
};


exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid ID'
      });
    }

    if (!content) {
      return res.status(400).json({
        status: 'fail',
        message: 'Content is required to update'
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Comment not found'
      });
    }

    // Make sure user owns the comment
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: "You can't edit someone else's comment"
      });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json({
      status: 'success',
      data: comment
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server Error'
    });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid ID'
      });
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        status: 'fail',
        message: 'Comment not found'
      });
    }

    // Check the owner
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: "You can't delete someone else's comment"
      });
    }

    await Comment.findByIdAndDelete(id);

    return res.status(204).json({
      status: 'success',
      data: null
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server Error'
    });
  }
};

