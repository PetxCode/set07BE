const pictureModel = require("../model/pictureModel");
const cloudinary = require("../utils/cloudinary");

const getPictures = async (req, res) => {
  try {
    const pix = await pictureModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ message: "gotten", data: pix });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getPicture = async (req, res) => {
  try {
    const pix = await pictureModel.findById(req.params.id);
    res.status(200).json({ message: "gotten", data: pix });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createPicture = async (req, res) => {
  try {
    const { title } = req.body;
    // const pixData = await cloudinary.uploader.upload(req.file.path);

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

    const pixData = await streamUpload(req);

    const pix = await pictureModel.create({
      title,
      image: pixData.secure_url,
      imageID: pixData.public_id,
    });
    res.status(200).json({ message: "gotten", data: pix });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deletePictures = async (req, res) => {
  try {
    const pixID = await pictureModel.findById(req.params.id);

    if (pixID) {
      await cloudinary.uploader.destroy(pixID.imageID);

      const pix = await pictureModel.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "deleted", data: pix });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  deletePictures,
  createPicture,
  getPicture,
  getPictures,
};
