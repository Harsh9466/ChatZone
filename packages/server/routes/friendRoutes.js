const express = require("express");
const router = express.Router();
const {
  getAllFriends,
  getAllFriendRequests,
  sendFriendRequest,
  acceptFriendRequest
} = require("../controllers/friendController");

const { protect } = require("../controllers/authController");

router.use(protect);
router.get("/", getAllFriends);
router.post("/sendRequest/:recieverId", sendFriendRequest);
router.post("/acceptRequest/:userId", acceptFriendRequest);

module.exports = router;
