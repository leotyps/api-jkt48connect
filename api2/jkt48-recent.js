const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key
const app = express();
const router = express.Router();

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: "*",
}));

// Fungsi untuk format angka ke mata uang Rupiah
function formatRupiah(amount) {
  return `Rp ${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

// Endpoint untuk mengambil data recent berdasarkan grup
router.get("/", validateApiKey, async (req, res) => {
  const group = req.query.group || "jkt48"; // Grup default adalah "jkt48"

  try {
    // Meminta data dari API recent berdasarkan grup
    const response = await axios.get(`https://api.crstlnz.my.id/api/recent?group=${group}&type=all`);
    const recentData = response.data;

    // Modifikasi data untuk menambahkan total gift dalam format Rupiah
    const modifiedRecents = recentData.recents.map((item) => {
      const totalGiftIDR = item.gift_rate * item.points; // Hitung total gift
      return {
        ...item,
        total_gift: formatRupiah(totalGiftIDR), // Tambahkan total gift dalam format Rupiah
      };
    });

    // Menambahkan author ke dalam respons
    res.json({
      ...modifiedRecents,
    });
  } catch (error) {
    console.error(`Error fetching recent data for group ${group}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      author: "Valzyy",
      message: `Gagal mengambil data recent untuk grup ${group}.`,
      error: error.message,
    });
  }
});

module.exports = router;
