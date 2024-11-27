const express = require("express");
const axios = require("axios");
const cors = require('cors');
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key

const router = express.Router();


// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*', 
}));

// Endpoint untuk mengambil data member yang tidak graduate
router.get("/", validateApiKey, async (req, res) => {
  const group = req.query.group || "jkt48"; // Grup default adalah "jkt48"

  try {
    // Meminta data dari API member berdasarkan grup
    const response = await axios.get(`https://api.crstlnz.my.id/api/member?group=${group}`);
    const members = response.data;

    // Filter untuk hanya menyertakan member yang tidak graduate
    const activeMembers = members.filter((member) => member.is_graduate === false);

    // Mengembalikan data yang difilter dalam bentuk JSON
    res.json({
      author: "Valzyy",
      ...activeMembers,
    });
  } catch (error) {
    console.error(`Error fetching members for group ${group}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      author: "Valzyy",
      message: `Gagal mengambil data member untuk grup ${group}.`,
      error: error.message,
    });
  }
});

module.exports = router;
