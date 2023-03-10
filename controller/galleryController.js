const userModel = require("../model/userModel");
const interestModel = require("../model/galleryModel");
const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");
const { createLearning } = require("./learningController");

const createGallery = async (req, res) => {
  try {
    // const image = await cloudinary.uploader.upload(req.file.path);

    let streamUpload = (req) => {
      return new Promise(async (resolve, reject) => {
        let stream = await cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              return resolve(result);
            } else {
              return reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const image = await streamUpload(req);

    const getUser = await userModel.findById(req.params.id);
    const interested = new interestModel({
      image: image.secure_url,
      imageID: image.public_id,
    });

    interested.user = getUser;
    interested.save();

    getUser.gallary.push(mongoose.Types.ObjectId(interested._id));
    getUser.save();

    res.status(201).json({
      status: "gallary added successfully",
      data: interested,
    });
  } catch (err) {
    res.status(404).json({
      status: err.message,
    });
  }
};

const showGallery = async (req, res) => {
  try {
    const getUser = await userModel.findById(req.params.id).populate({
      path: "gallary",
      options: {
        limit: 3,
        sort: { createdAt: -1 },
      },
    });

    res.status(200).json({
      status: "successful",
      data: getUser,
    });
  } catch (err) {
    res.status(404).json({
      status: err.message,
    });
  }
};

const showAllGallery = async (req, res) => {
  try {
    const getUser = await userModel.findById(req.params.id).populate({
      path: "gallary",
      options: {
        sort: { createdAt: -1 },
      },
    });

    res.status(200).json({
      status: "successful",
      data: getUser,
    });
  } catch (err) {
    res.status(404).json({
      status: err.message,
    });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const getUser = await userModel.findById(req.params.id);

    const deleteData = await interestModel.findByIdAndRemove(
      req.params.gallary
    );

    if (deleteGallery) {
      await cloudinary.uploader.destroy(deleteGallery.imageID);
      getUser.gallary.pull(deleteData);
      getUser.save();

      res.status(200).json({
        status: "deleted",
        data: getUser,
      });
    }
  } catch (err) {
    res.status(404).json({
      status: err.message,
    });
  }
};

module.exports = {
  showAllGallery,
  createGallery,
  showGallery,
  deleteGallery,
};
