const express = require("express");
const axios = require("axios");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key

const router = express.Router();

// Endpoint untuk mengambil data recent dan upcoming theater berdasarkan nama member
router.get("/:namaMember", validateApiKey, async (req, res) => {
  const { namaMember } = req.params; // Mendapatkan nama member dari parameter URL

  try {
    // Meminta data dari API berdasarkan nama member
    const response = await axios.get(`https://api.crstlnz.my.id/api/member/${namaMember}`);
    const memberData = response.data;

    // Menyaring data yang diperlukan
    const { 
      nickname, 
      fullname, 
      img, 
      img_alt, 
      banner, 
      description, 
      recentTheater, 
      upcomingTheater 
    } = memberData;

    // Mengembalikan data dalam format JSON
    res.json({
      nickname,
      fullname,
      img,
      img_alt,
      banner,
      description,
      recentTheater,
      upcomingTheater
    });
  } catch (error) {
    console.error(`Error fetching member theater data for ${namaMember}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: `Gagal mengambil data theater untuk member ${namaMember}.`,
      error: error.message,
    });
  }
});

module.exports = router;
