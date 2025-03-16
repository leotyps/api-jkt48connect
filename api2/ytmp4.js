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

  if (!url || !ytdl.validateURL(url)) {
    console.error("[ERROR] Invalid URL:", url);
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    // Ambil informasi video
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });

    if (!format?.url) {
      console.error("[ERROR] No valid MP4 format found for:", url);
      return res.status(400).json({ error: "No valid MP4 format available" });
    }

    // Return data murni tanpa tambahan teks
    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      video_url: format.url,
    });
  } catch (error) {
    console.error("[ERROR] Failed to process video:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
