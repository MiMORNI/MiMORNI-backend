const express = require("express");
const User = require("../models/User");
const { Storage } = require("@google-cloud/storage");

const router = express.Router();

const storage = new Storage();

const bucketName = "mimorni-media";

router.post("/uploadImage", (req, res) => {
  const username = req.body.username;
  const filepath = req.body.filepath;
  const pathParts = filepath.split("/");
  const filename = pathParts[pathParts.length - 1];
  uploadFile(filepath, filename);
  makePublic(filename);

  // Add image to user who uploaded it
  const imgUrl = `https://storage.cloud.google.com/${bucketName}/${filename}`;
  User.findOne({ username: username })
    .then((user) => {
      if (user.images.includes(imgUrl)) return;
      user.images.push(imgUrl);
      user.save();
    })
    .then(() => {
      res.json({ success: true });
    });
});

router.get("/getUserImages/:username", (req, res) => {
  const username = req.params.username;
  User.findOne({ username: username }).then((user) => {
    res.json({ images: user.images });
  });
});

async function uploadFile(filepath, destination) {
  await storage.bucket(bucketName).upload(filepath, {
    destination: destination,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });
}

async function makePublic(filename) {
  // Makes the file public
  await storage.bucket(bucketName).file(filename).makePublic();
  console.log(`gs://${bucketName}/${filename} is now public`);
}

module.exports = router;
