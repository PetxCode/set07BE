const mongoose = require("mongoose");
const cloudinary = require("../utils/cloudinary");
const voteInstructorModel = require("../model/voteStudentModel");

const createVoteEntry = async (req, res) => {
  try {
    const { name, course } = req.body;

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

    const newEntry = await voteInstructorModel.create({
      name,
      course,
      role: "Student",
      image: image.secure_url,
      imageID: image.public_id,
    });
    res.status(201).json({ message: "Student created", data: newEntry });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getAllVoteEntry = async (req, res) => {
  try {
    const newEntry = await voteInstructorModel.find({}).sort({ createdAt: -1 });

    res.status(200).json({ message: "View all Student", data: newEntry });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getVoteEntry = async (req, res) => {
  try {
    const newEntry = await voteInstructorModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(1);

    res.status(200).json({ message: "View Student", data: newEntry });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const get2VoteEntry = async (req, res) => {
  try {
    const newEntry = await voteInstructorModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(2);

    res.status(200).json({ message: "View Student", data: newEntry });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteVoteEntry = async (req, res) => {
  try {
    await voteInstructorModel.deleteMany();
    res.status(200).json({ message: "All Deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const Vote = async (req, res) => {
  try {
    const voted = await voteInstructorModel.findById(req.params.id);

    res.status(201).json({ message: "voted", data: voted });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const VoteEntry = async (req, res) => {
  try {
    const voted = await voteInstructorModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { user: req.params.voterID },
      },
      { new: true }
    );

    const getUser = await voteInstructorModel.findById(req.params.id);
    const voterData = getUser.user.length;
    console.log("voter: ", voterData);

    await voteInstructorModel.findByIdAndUpdate(
      req.params.id,
      {
        voter: voterData,
      },
      { new: true }
    );

    res.status(201).json({ message: "voted", data: { voted, voterData } });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteVote = async (req, res) => {
  try {
    const voted = await voteInstructorModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { user: req.params.voterID },
      },
      { new: true }
    );

    const getUser = await voteInstructorModel.findById(req.params.id);
    const voterData = getUser.user.length;
    console.log("voter delete: ", voterData);

    await voteInstructorModel.findByIdAndUpdate(
      req.params.id,
      {
        voter: voterData,
      },
      { new: true }
    );

    // console.log("view Delete: ", getUser.user.length);
    res
      .status(201)
      .json({ message: "vote Deleted", data: { voted, voterData } });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  deleteVote,
  getAllVoteEntry,
  createVoteEntry,
  getVoteEntry,
  deleteVoteEntry,
  VoteEntry,
  get2VoteEntry,
  Vote,
};
