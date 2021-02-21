const express = require("express");
const User = require("../models/User");
const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");
const dotenv = require("dotenv");
const { format } = require("util");

dotenv.config();

const router = express.Router();

const storage = new Storage();

// Multer is required to process file uploads and make them available via
// req.files.
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // no larger than 50MB
  },
});

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);
const bucketName = process.env.GCLOUD_STORAGE_BUCKET;

/**
 * Upload an image for a user
 * @return  {JSON} - return URL of image location
 */
router.post("/uploadImage", multer.single("image"), (req, res, next) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  blobStream.on("error", (err) => {
    next(err);
  });

  blobStream.on("finish", () => {
    // The public URL can be used to directly access the file via HTTP.
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );
    res.status(200).send(publicUrl);
  });

  blobStream.end(req.file.buffer);
});

/**
 * Get a user's images
 * @param {string} req.params.username - Requested user's username
 * @return  {JSON} - return user's image URLs
 */
router.get("/getUserImages/:username", (req, res) => {
  const username = req.params.username;
  User.findOne({ username: username }).then((user) => {
    res.json({ images: user.images });
  });
});

/**
 * Get all images in a give community
 * @return  {JSON} - return all image URLs in a community
 */
router.get("/getCommunityImages", (req, res) => {
  let urls = [];
  User.find({}).then((users) => {
    for (let user in users) {
      const images = users[user].images;
      urls.push(...images);
    }
    res.json({ urls: urls });
  });
});

module.exports = router;
