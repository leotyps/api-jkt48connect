const express = require("express");
const ApiKey = require("../models/apiKey"); // Import model ApiKey
const validateApiKey = require("../middleware/auth"); // Middleware untuk validasi API key
const app = express();
const router = express.Router();

// Enable CORS
const cors = require("cors");
app.use(cors({
  origin: "*",
}));

// Endpoint untuk memeriksa apakah API key ada di MongoDB
router.get("/check-api-key", validateApiKey, async (req, res) => {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      message: "API key tidak ditemukan di header atau query parameter.",
    });
  }

  try {
    // Cek apakah API key ada di MongoDB
    const apiKeyData = await ApiKey.findOne({ key: apiKey });

    if (!apiKeyData) {
      return res.status(404).json({
        success: false,
        message: "API key tidak ditemukan di database.",
      });
    }

    // Jika ditemukan, kembalikan data API key
    res.status(200).json({
      success: true,
      message: "API key ditemukan di database.",
      apiKeyData: {
        key: apiKeyData.key,
        expiryDate: apiKeyData.expiryDate,
        remainingRequests: apiKeyData.remainingRequests,
        maxRequests: apiKeyData.maxRequests,
        lastAccessDate: apiKeyData.lastAccessDate,
      },
    });
  } catch (error) {
    console.error("Error fetching API key data:", error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat memeriksa data API key.",
      error: error.message,
    });
  }
});

module.exports = router;
