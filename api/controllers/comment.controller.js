import Comment from "../models/comment.model.js";
import { errorHandeler } from "../utils/error.js";

// create a comment functionality
export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandeler(403, 'You are not allowed to create this comment')
      );
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

// get all the comment functionality
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({postId: req.params.postId}).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// like the comment functionality
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandeler(404, 'Comment not found'));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// edit comment functionality
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
      return next(errorHandeler(403, "Comment not found!"));
    }
    if(comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandeler(403, "You are not allowed to edit the comment"));
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId, 
      {
        content: req.body.content,
      },
      {
        new: true
      }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
}

// delete comment functionality
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
      return next(errorHandeler(403, "Comment not found!"));
    }
    if(comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(errorHandeler(403, "You are not allowed to edit the comment"));
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment has been deleted");
  } catch (error) {
    next(error);
  }
}