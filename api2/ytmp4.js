const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key

const router = express.Router();

// Enable CORS untuk semua domain
router.use(cors({ origin: "*" }));

// API Endpoint Y2Mate
const API_URL = "https://www.y2mate.com/mates/en68";

// Endpoint utama untuk konversi YouTube ke MP4
router.get("/", validateApiKey, async (req, res) => {
  const { url } = req.query; // Ambil URL dari query parameter
  if (!url) {
    console.error("[ERROR] Missing URL parameter.");
    return res.status(400).json({ error: "Missing URL parameter" });
  }

  try {
    console.log(`[INFO] Fetching data from Y2Mate for: ${url}`);

    // Step 1: Ambil ID video dari URL
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (!videoIdMatch) {
      console.error("[ERROR] Invalid YouTube URL format.");
      return res.status(400).json({ error: "Invalid YouTube URL format" });
    }
    const videoId = videoIdMatch[1];

    // Step 2: Kirim permintaan ke Y2Mate
    const { data: searchData } = await axios.post(`${API_URL}/analyze`, new URLSearchParams({
      url,
      q_auto: 0,
      ajax: 1
    }));

    if (!searchData || !searchData.result) {
      console.error("[ERROR] Failed to fetch video data.");
      return res.status(500).json({ error: "Failed to fetch video data" });
    }

    // Step 3: Ambil kualitas MP4 terbaik
    const mp4Formats = searchData.result.links.mp4;
    const bestQuality = Object.values(mp4Formats).pop(); // Ambil resolusi tertinggi

    if (!bestQuality?.k) {
      console.error("[ERROR] No valid MP4 format found.");
      return res.status(400).json({ error: "No valid MP4 format available" });
    }

    // Step 4: Konversi video
    const { data: convertData } = await axios.post(`${API_URL}/convert`, new URLSearchParams({
      vid: searchData.result.vid,
      k: bestQuality.k
    }));

    if (!convertData?.result || !convertData.result.dlink) {
      console.error("[ERROR] Conversion failed.");
      return res.status(500).json({ error: "Conversion failed" });
    }

    // Return data dalam format JSON tanpa tambahan teks
    res.json({
      title: searchData.result.title,
      thumbnail: searchData.result.thumbnail,
      video_url: convertData.result.dlink
    });

  } catch (error) {
    console.error("[ERROR] API request failed:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

module.exports = router;
