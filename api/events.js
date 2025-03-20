const express = require("express");
const axios = require("axios");
const cors = require('cors');
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key
const app = express();
const router = express.Router();

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*',
}));

// Endpoint untuk mengambil data event
router.get("/", validateApiKey, async (req, res) => {
  try {
    const response = await axios.get("https://api.crstlnz.my.id/api/event");

    // Mengembalikan data asli tanpa modifikasi
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching event data:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data event.",
      error: error.message,
    });
  }
});

module.exports = router;
