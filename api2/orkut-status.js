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

// Endpoint untuk mengecek status pembayaran
router.get("/", validateApiKey, async (req, res) => {
  const { merchant, keyorkut, amount } = req.query; // Mendapatkan parameter merchant, keyorkut, dan amount dari query URL

  // Pastikan merchant, keyorkut, dan amount ada dalam query
  if (!merchant || !keyorkut || !amount) {
    return res.status(400).json({
      message: "Parameter 'merchant', 'keyorkut', dan 'amount' harus disertakan.",
    });
  }

  try {
    // Meminta data dari API cek status
    const response = await axios.get(`https://apiv2.abidev.tech/api/orkut/cekstatus?merchant=${merchant}&keyorkut=${keyorkut}&amount=${amount}`);
    const statusData = response.data;

    // Mengembalikan data dalam format JSON langsung
    res.json(statusData);
  } catch (error) {
    console.error("Error checking payment status:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal mengecek status pembayaran.",
      error: error.message,
    });
  }
});

module.exports = router;
