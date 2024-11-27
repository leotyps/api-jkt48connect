const express = require("express");
const axios = require("axios");
const cors = require('cors');
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key

const router = express.Router();


// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*', 
}));

// Endpoint untuk mengambil data live saat ini untuk grup tertentu
router.get("/", validateApiKey, async (req, res) => {
  const group = req.query.group || "jkt48"; // Grup default adalah "jkt48"

  try {
    // Meminta data dari API berdasarkan grup
    const response = await axios.get(`https://api.crstlnz.my.id/api/now_live?group=${group}`);
    const liveData = response.data;

    // Mengembalikan data dalam bentuk JSON
    res.json({
      author: "Valzyy",
      ...liveData,
    });
  } catch (error) {
    console.error(`Error fetching live data for group ${group}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      success: false,
      message: `Gagal mengambil data live untuk grup ${group}.`,
      error: error.message,
    });
  }
});

module.exports = router;
