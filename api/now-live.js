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

    // Proses setiap item di data utama (berbasis objek)
    Object.keys(liveData).forEach(key => {
      if (liveData[key].streaming_url_list && Array.isArray(liveData[key].streaming_url_list)) {
        // Tambahkan properti "jkt48connect" di setiap item dalam streaming_url_list
        liveData[key].streaming_url_list = liveData[key].streaming_url_list.map(item => ({
          ...item,
          jkt48connect: `https://www.jkt48connect.my.id/live?stream_url=${encodeURIComponent(item.url)}&name=${encodeURIComponent(liveData[key].name)}`
        }));
      }
    });

    // Kembalikan data yang sudah dimodifikasi
    res.json({
      ...liveData,
      author: "Valzyy", // Tambahkan properti author
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
