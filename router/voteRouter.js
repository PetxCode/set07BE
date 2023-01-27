const express = require("express");
const upload = require("../utils/multer");
const {
  deleteVote,
  createVoteEntry,
  getVoteEntry,
  deleteVoteEntry,
  VoteEntry,
  getAllVoteEntry,
  get2VoteEntry,
} = require("../controller/voteInstructorController");
const router = express.Router();
const multer = require("multer");
let uploadData = multer();
uploadData.single("avatar");

router.route("/create").post(uploadData.single("avatar"), createVoteEntry);
router.route("/").get(getVoteEntry);
router.route("/viewAll").get(getAllVoteEntry);
router.route("/view2").get(get2VoteEntry);

router.route("/:id/:voterID/vote").patch(VoteEntry);
router.route("/:id/:voterID/unvote").patch(deleteVote);

router.route("/deleteAll").delete(deleteVoteEntry);

module.exports = router;
