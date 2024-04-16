import User from "../models/user.model.js";
import { errorHandeler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({ message: "API is working" });
};

// update user functionality
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandeler(403, "You are not allowed to update this user!"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandeler(400, "Password must contain at least 6 characters!")
      );
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandeler(400, "Username must be between 7 and 20 characters!")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandeler(400, "Username can not contain spaces!"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandeler(400, "Username must be in lowercase!"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandeler(400, "Username can only contains letters and numbers!")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// delete user functionality
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId){
    return next (errorHandeler(403, "You are not allowed to delete this user!"));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// signout functionality
export const signout = (req, res, next) => {
  try {
    res.clearCookie("access_token").status(200).json("User has been signed out");
  } catch (error) {
    next(error);
  }
}

// get all the user functionality
export const getusers = async (req, res, next) => {
  if(!req.user.isAdmin) {
    return next(errorHandeler(403, "You are not allowed to see the users!"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
      const userWithoutPassword = users.map((user) => {
        const { password, ...rest } = user._doc;
        return rest;
      });
      const totalUsers = await User.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
      );
      const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
      res.status(200).json({
        users: userWithoutPassword,
        totalUsers,
        lastMonthUsers
      })
  } catch (error) {
    next(error);
  }
}