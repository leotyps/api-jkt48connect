const express = require("express");
const axios = require("axios");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key

const router = express.Router();

// Variabel untuk menyimpan semua data yang pernah ada
let savedLiveData = [];

// Endpoint utama
router.get("/", validateApiKey, async (req, res) => {
  try {
    // Ambil data dari API now_live saat ini
    const response = await axios.get("https://api.crstlnz.my.id/api/now_live?group=jkt48");
    const currentLiveData = response.data;

    // Proses data baru dan tambahkan ke savedLiveData tanpa mengganti data lama
    currentLiveData.forEach((live) => {
      // Cek apakah data ini sudah ada di savedLiveData
      const exists = savedLiveData.some(
        (saved) => saved.name.toLowerCase() === live.name.toLowerCase() && saved.room_id === live.room_id
      );

      // Jika belum ada, tambahkan ke savedLiveData
      if (!exists) {
        savedLiveData.push({
          name: live.name,
          img: live.img,
          img_alt: live.img_alt,
          url_key: live.url_key,
          room_id: live.room_id,
          started_at: live.started_at,
          streaming_url_list: live.streaming_url_list,
          type: live.type,
        });
      }
    });

    // Tampilkan semua data yang pernah ada
    res.json(savedLiveData);
  } catch (error) {
    console.error("Error fetching or processing live data:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal mengambil data live.",
      error: error.message,
    });
  }
});

module.exports = router;
