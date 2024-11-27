const express = require("express");
const axios = require("axios");
const cors = require('cors');
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key

const router = express.Router();


// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*', 
}));

// Endpoint untuk mengambil data theater
router.get("/", validateApiKey, async (req, res) => {
  try {
    // Meminta data dari API theater
    const response = await axios.get("https://api.crstlnz.my.id/api/theater");
    const theaterData = response.data;

    // Mengembalikan data dalam bentuk JSON
    res.json({
      author: "Valzyy",
      ...theaterData,
    });
  } catch (error) {
    console.error("Error fetching theater data:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data theater.",
      error: error.message,
    });
  }
});

module.exports = router;
