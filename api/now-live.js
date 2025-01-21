const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key
const app = express();
const router = express.Router();

// Enable CORS
app.use(cors({
  origin: "*",
}));

// Endpoint untuk mengambil data live saat ini untuk grup tertentu
router.get("/", validateApiKey, async (req, res) => {
  const group = req.query.group || "jkt48"; // Grup default adalah "jkt48"

  try {
    // Ambil data live dari API eksternal
    const response = await axios.get(`https://api.crstlnz.my.id/api/now_live?group=${group}`);
    const liveData = response.data;

    // Kembalikan data langsung tanpa modifikasi
    res.json(liveData);
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
