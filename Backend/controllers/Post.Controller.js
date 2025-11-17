const Post = require('../models/post.model');
const mongoose = require('mongoose');


exports.createPost = async (req, res) => {
  try {
    const { title, body } = req.body;
    const userId = req.user?._id;

    if (!title || !body) {
      return res.status(400).json({ status: 'fail', message: 'Title and Body are required' });
    }

    let imagePath;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`; // store relative path
    }

    const post = await Post.create({
      title,
      body,
      userId,
      image: imagePath
    });

    return res.status(201).json({ status: 'success', data: post });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error', message: 'Server Error' });
  }
};




exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name username")
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: 'name username' }
      });

    return res.status(200).json({
      status: 'success',
      results: posts.length,
      data: posts
    });

  } catch (error) {
    console.error(error); // Add this to see the real error in console
    return res.status(500).json({
      status: 'error',
      message: 'Server Error'
    });
  }
};




exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid ID'
      });
    }

    const post = await Post.findById(id).populate("userId", "name username");

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: post
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server Error'
    });
  }
};




exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid ID'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found'
      });
    }

    
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not allowed to update this post'
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({
      status: 'success',
      data: updatedPost
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server Error'
    });
  }
};




exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid ID'
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found'
      });
    }

   
    if (post.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        status: 'fail',
        message: 'You are not allowed to delete this post'
      });
    }

    await Post.findByIdAndDelete(id);

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

