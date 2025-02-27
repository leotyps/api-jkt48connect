const express = require("express");
const axios = require("axios");
const cors = require('cors');
const validateApiKey = require("../middleware/premium"); // Middleware validasi API key
const app = express();
const router = express.Router();

// Enable CORS
app.use(cors({
  origin: '*',
}));

// Endpoint untuk mencari data member berdasarkan nama atau nama panggilan
router.get("/:name", validateApiKey, async (req, res) => {
  const { name } = req.params; // Mendapatkan nama dari parameter URL

  try {
    // Ambil data semua member dari API JKT48Connect
    const membersResponse = await axios.get("https://api.jkt48connect.my.id/api/member?api_key=JKTCONNECT");
    const membersData = membersResponse.data;

    // Pastikan `membersData` adalah array sebelum melakukan pencarian
    if (!Array.isArray(membersData)) {
      return res.status(500).json({
        success: false,
        message: "Data member tidak valid dari API.",
      });
    }

    // Cari member dengan nama lengkap atau nama panggilan (case-insensitive)
    const foundMember = membersData.find(member => 
      member.name.toLowerCase() === name.toLowerCase() || 
      member.nickname.toLowerCase() === name.toLowerCase()
    );

    if (!foundMember) {
      return res.status(404).json({
        success: false,
        message: `Member dengan nama "${name}" tidak ditemukan.`,
      });
    }

    // Gunakan "url" dari hasil pencarian sebagai parameter pencarian detail di API crstlnz
    const memberUrl = foundMember.url;
    const response = await axios.get(`https://api.crstlnz.my.id/api/member/${memberUrl}`);
    
    // Kirim data JSON langsung tanpa tambahan atribut lain
    res.json(response.data);
    
  } catch (error) {
    console.error(`Error fetching member detail for ${name}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      success: false,
      message: `Gagal mengambil data member dengan nama "${name}".`,
      error: error.message,
    });
  }
});

module.exports = router;
