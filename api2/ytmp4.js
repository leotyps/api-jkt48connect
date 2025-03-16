const express = require("express");
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key

const router = express.Router();

// Enable CORS untuk semua domain
router.use(cors({ origin: "*" }));

// Endpoint utama untuk konversi YouTube ke MP4
router.get("/", validateApiKey, async (req, res) => {
  const { url } = req.query; // Ambil URL dari query parameter
  if (!url) {
    console.error("[ERROR] Missing URL parameter.");
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    console.log(`[INFO] Fetching video info for: ${url}`);

    // Ambil informasi video menggunakan ytdl-core
    const info = await ytdl.getInfo(url);
    if (!info || !info.videoDetails) {
      console.error("[ERROR] Failed to fetch video details.");
      return res.status(400).json({ error: "Failed to fetch video details" });
    }

    // Ambil kualitas video terbaik
    const formats = ytdl.filterFormats(info.formats, "videoandaudio");
    if (!formats.length) {
      console.error("[ERROR] No valid MP4 format found.");
      return res.status(400).json({ error: "No valid MP4 format available" });
    }

    const bestFormat = formats.reduce((max, format) =>
      format.qualityLabel > max.qualityLabel ? format : max
    );

    // Return data dalam format JSON
    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails.pop().url,
      video_url: bestFormat.url,
      quality: bestFormat.qualityLabel,
    });

  } catch (error) {
    console.error("[ERROR] API request failed:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
