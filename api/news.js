const express = require("express");
const axios = require("axios");

const router = express.Router();

// Endpoint untuk mengambil data berita
router.get("/", async (req, res) => {
  try {
    // Meminta data dari API berita
    const response = await axios.get("https://api.crstlnz.my.id/api/news");
    const newsData = response.data;

    // Mengembalikan data dalam bentuk JSON
    res.json({
      success: true,
      author: "Valzyy",
      data: newsData,
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
