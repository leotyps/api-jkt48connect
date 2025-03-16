const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key

const router = express.Router();

// Enable CORS untuk semua domain
router.use(cors({ origin: "*" }));

// Endpoint utama untuk mengonversi YouTube ke MP4
router.get("/", validateApiKey, async (req, res) => {
  const { url } = req.query; // Ambil URL dari query parameter

  if (!url || !ytdl.validateURL(url)) return res.status(400).end();

  try {
    // Ambil informasi video
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });

    if (!format?.url) return res.status(400).end();

    // Return data murni tanpa tambahan teks
    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      video_url: format.url,
    });
  } catch {
    res.status(500).end();
  }
});

module.exports = router;
