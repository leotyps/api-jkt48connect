const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key

const app = express();
const router = express.Router();

// Enable CORS untuk semua domain
app.use(cors({
  origin: '*',
}));

// Endpoint untuk mengambil data TikTok
router.get("/", validateApiKey, async (req, res) => {
  const query = req.query.url; // Ambil URL dari query parameter
  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Parameter 'url' diperlukan.",
    });
  }

  try {
    const encodedParams = new URLSearchParams();
    encodedParams.set("url", query);
    encodedParams.set("hd", "1");

    const response = await axios({
      method: "POST",
      url: "https://tikwm.com/api/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Cookie": "current_language=en",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
      },
      data: encodedParams,
    });

    const videos = response.data.data;

    // Return data dalam bentuk JSON
    res.json({
      success: true,
      author: "Valzyy",
      title: videos.title,
      cover: videos.cover,
      origin_cover: videos.origin_cover,
      no_watermark: videos.play,
      watermark: videos.wmplay,
      music: videos.music,
    });
  } catch (error) {
    console.error("Error fetching TikTok data:", error.message);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data dari TikTok.",
      error: error.message,
    });
  }
});

module.exports = router;
