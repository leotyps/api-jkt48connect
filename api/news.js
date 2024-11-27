const express = require("express");
const axios = require("axios");
const cors = require('cors');
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key

const router = express.Router();


// Enable CORS for all domains (or specific domains)
// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*', // Atau set domain spesifik, misalnya 'https://yourfrontenddomain.com'
}));

// Endpoint untuk mengambil data berita
router.get("/", validateApiKey, async (req, res) => {
  try {
    // Meminta data dari API berita
    const response = await axios.get("https://api.crstlnz.my.id/api/news");
    const newsData = response.data;

    // Mengembalikan data dalam bentuk JSON
    res.json({
      author: "Valzyy",
      ...newsData,
    });
  } catch (error) {
    console.error("Error fetching news data:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      success: false,
      message: "Gagal mengambil data berita.",
      error: error.message,
    });
  }
});

module.exports = router;
