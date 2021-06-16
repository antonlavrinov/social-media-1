const { cloudinary } = require("../utils/cloudinary");

exports.uploadImage = async (req, res) => {
  try {
    let result = await cloudinary.uploader.upload(req.body.image, {
      upload_preset: "social_images",
      public_id: `${Date.now()}`,

      resource_type: "auto", // jpeg, png
    });
    res.json({
      public_id: result.public_id,
      url: result.secure_url,
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};

exports.removeImage = async (req, res) => {
  try {
    let image_id = req.params.id;
    console.log(req.params);

    cloudinary.uploader.destroy(image_id, (err, result) => {
      if (err.result !== "ok") {
        console.log("err", err);
        return res.status(400).json({ message: "Could not remove image" });
      }
      res.send({ message: "Картинка удалена" });
    });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ message: "Something went wrong. Try one more time!" });
  }
};
