const express = require("express");
const upload = require("../utils/multer");
// const logo = require("../utils/logo");
const {
  showAllGallery,
  createGallery,
  showGallery,
  deleteGallery,
} = require("../controller/galleryController");
const router = express.Router();
const multer = require("multer");
let uploadData = multer();
// uploadData.single("avatar")

router.route("/:id/limit").get(showGallery);
router.route("/:id").get(showAllGallery);
router.route("/:id/:gallary").delete(deleteGallery);
router.route("/:id/create").post(uploadData.single("avatar"), createGallery);

module.exports = router;
