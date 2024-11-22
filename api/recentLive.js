const express = require("express");
const axios = require("axios");
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key

const router = express.Router();

// Endpoint untuk mengambil data live berdasarkan ID
router.get("/:liveid", validateApiKey, async (req, res) => {
  const { liveid } = req.params; // Mendapatkan liveid dari parameter URL

  try {
    // Meminta data dari API berdasarkan liveid
    const response = await axios.get(`https://api.crstlnz.my.id/api/recent/${liveid}`);
    const recentLiveData = response.data;

    // Mengembalikan data dalam format JSON langsung
    res.json({
      author: "Valzyy",
      ...recentLiveData, // Menyisipkan data langsung
    });
  } catch (error) {
    console.error(`Error fetching recent live data with ID ${liveid}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: `Gagal mengambil data recent live dengan ID ${liveid}.`,
      error: error.message,
    });
  }
});

module.exports = router;
