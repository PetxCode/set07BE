const express = require("express");
const upload = require("../utils/multer");

const {
  deletePictures,
  createPicture,
  getPicture,
  getPictures,
} = require("../controller/pictureControllerer");
const router = express.Router();
const multer = require("multer");
let uploadData = multer();
// uploadData.single("avatar");

router.route("/:id").get(getPicture);
router.route("/").get(getPictures);
router.route("/:id/").delete(deletePictures);
router.route("/create").post(uploadData.single("avatar"), createPicture);

module.exports = router;
