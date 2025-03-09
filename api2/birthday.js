const express = require("express");
const axios = require("axios");
const cors = require('cors');
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key
const app = express();
const router = express.Router();

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*', 
}));

// Endpoint untuk mengambil data next birthday berdasarkan grup
router.get("/next-birthday", validateApiKey, async (req, res) => {
  const group = req.query.group || "jkt48"; // Grup default adalah "jkt48"

  try {
    // Meminta data dari API next birthday berdasarkan grup
    const response = await axios.get(`https://api.crstlnz.my.id/api/next_birthday?group=${group}`);
    const birthdayData = response.data;

    // Menambahkan author ke dalam respons
    res.json(birthdayData);
  } catch (error) {
    console.error(`Error fetching next birthday data for group ${group}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      author: "Valzyy",
      message: `Gagal mengambil data next birthday untuk grup ${group}.`,
      error: error.message,
    });
  }
});

module.exports = router;
