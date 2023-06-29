const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

const ObjectId = (str = "") => new mongoose.Types.ObjectId(str);

exports.getAllFriends = catchAsync(async (req, res) => {
  const currentUserId = ObjectId(req.user._id);

  const data = await User.findOne({ _id: currentUserId })
    .populate([
      { path: "friends", select: "_id name photo" },
      { path: "friendRequests.sender", select: "name photo" },
    ])
    .select("friends friendRequests");

  // Send Response
  res.status(200).json({
    status: "success",
    data: { friends: data.friends, friendRequests: data.friendRequests },
  });
});

exports.sendFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = ObjectId(req.user._id);
  const receiverId = ObjectId(req.params.recieverId);

  const isAlreadyFriend = !!(await User.findOne({
    _id: currentUserId,
    friends: receiverId,
  }));

  const isAlreadyRequested = !!(await User.findOne({
    _id: receiverId,
    "friendRequests.sender": currentUserId,
  }));

  if (isAlreadyFriend) {
    return next(new AppError("This user is already your friend.", 400));
  }

  if (req.user._id == req.params.recieverId) {
    return next(new AppError("You can't send request to yourself.", 400));
  }

  if (isAlreadyRequested) {
    return next(new AppError("Request already sent.", 400));
  }

  await User.findByIdAndUpdate(receiverId, {
    $push: { friendRequests: { sender: currentUserId } },
  });

  res.status(200).json({
    status: "success",
    data: "Friend Request Sent!",
  });
});

exports.acceptFriendRequest = catchAsync(async (req, res, next) => {
  const currentUserId = ObjectId(req.user._id);
  const userIdToAccept = ObjectId(req.params.userId);

  const isRequestExist = !!(await User.findOne({
    _id: currentUserId,
    "friendRequests.sender": userIdToAccept,
  }));

  const isAlreadyFriend = !!(await User.findOne({
    _id: currentUserId,
    friends: userIdToAccept,
  }));

  if (isAlreadyFriend) {
    return next(new AppError("This user is already your friend.", 400));
  }

  if (!isRequestExist) {
    return next(
      new AppError("This user is not requested to be your friend.", 400)
    );
  }

  if (req.user._id == req.params.userId) {
    return next(new AppError("You can't become friend of yourself.", 400));
  }
  
  await User.findByIdAndUpdate(currentUserId, {
    $pull: { friendRequests: { sender: userIdToAccept } },
  });

  await User.findByIdAndUpdate(currentUserId, {
    $push: { friends: userIdToAccept },
  });

  await User.findByIdAndUpdate(userIdToAccept, {
    $pull: { friendRequests: { sender: currentUserId } },
  });

  await User.findByIdAndUpdate(userIdToAccept, {
    $push: { friends: currentUserId },
  });

  return res.status(200).json({
    status: "success",
    data: "Request Accepted",
  });
});
