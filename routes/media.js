const express = require("express");
const { Storage } = require("@google-cloud/storage");

const router = express.Router();

const storage = new Storage();

const bucketName = "mimorni-media";

router.post("/uploadImg", (req, res) => {
  const filepath = req.body.filepath;
  const pathParts = filepath.split("/");
  const filename = pathParts[pathParts.length - 1];
  uploadFile(filepath, filename);
  res.json({ success: true });
});

async function uploadFile(filepath, destination) {
  await storage.bucket(bucketName).upload(filepath, {
    destination: destination,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });
}

module.exports = router;
