const express = require("express");
const router = express.Router();
const {
  getAllFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  searchFriendsByUsername,
} = require("../controllers/friendController");

const { protect } = require("../controllers/authController");

router.use(protect);
router.get("/", getAllFriends);
router.post("/searchFriends", searchFriendsByUsername);
router.post("/sendRequest/:recieverId", sendFriendRequest);
router.post("/acceptRequest/:userId", acceptFriendRequest);
router.post("/rejectRequest/:userId", rejectFriendRequest);

module.exports = router;
