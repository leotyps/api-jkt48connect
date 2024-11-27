const express = require("express");
const axios = require("axios");
const cors = require('cors');
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key

const router = express.Router();


// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*', 
}));

// Endpoint untuk mengambil data berita berdasarkan ID
router.get("/:id", validateApiKey, async (req, res) => {
  const { id } = req.params; // Mendapatkan ID dari parameter URL

  try {
    // Meminta data dari API berdasarkan ID
    const response = await axios.get(`https://api.crstlnz.my.id/api/news/${id}`);
    const newsDetail = response.data;

    // Mengembalikan data dalam bentuk JSON
    res.json({
      author: "Valzyy",
      ...newsDetail,
    });
  } catch (error) {
    console.error(`Error fetching news detail with ID ${id}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      success: false,
      message: `Gagal mengambil data berita dengan ID ${id}.`,
      error: error.message,
    });
  }
});

module.exports = router;
