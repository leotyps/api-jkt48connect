const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key

const router = express.Router();

// Enable CORS untuk semua domain
router.use(cors({ origin: "*" }));

// API provider untuk mengonversi YouTube ke MP4
const PROVIDERS = [
  {
    name: "snappea",
    url: (videoUrl) => `https://api.snappea.com/v1/video/details?url=${encodeURIComponent(videoUrl)}`,
    getData: (response) => {
      const bestVideo = response.data.videoInfo?.medias?.find((v) => v.ext === "mp4");
      return bestVideo ? { title: response.data.videoInfo.title, thumbnail: response.data.videoInfo.cover, video_url: bestVideo.url } : null;
    },
  },
  {
    name: "vevioz",
    url: (videoUrl) => `https://api.vevioz.com/api/button/mp4?url=${encodeURIComponent(videoUrl)}`,
    getData: (response) => {
      const videoMatch = response.data.match(/href="(https?:\/\/[^"]+\.mp4)"/);
      return videoMatch ? { video_url: videoMatch[1] } : null;
    },
  },
];

// Endpoint utama untuk konversi YouTube ke MP4
router.get("/", validateApiKey, async (req, res) => {
  const { url } = req.query; // Ambil URL dari query parameter
  if (!url) {
    console.error("[ERROR] Missing URL parameter.");
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  for (const provider of PROVIDERS) {
    try {
      console.log(`[INFO] Trying ${provider.name} for: ${url}`);
      const { data } = await axios.get(provider.url(url));
      const result = provider.getData(data);

      if (result) {
        console.log(`[SUCCESS] ${provider.name} provided a valid response.`);
        return res.json(result);
      }
    } catch (error) {
      console.error(`[ERROR] ${provider.name} failed:`, error.message);
    }
  }

  res.status(500).json({ error: "Failed to retrieve MP4 video" });
});

module.exports = router;
