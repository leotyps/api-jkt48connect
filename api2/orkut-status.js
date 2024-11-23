const express = require("express");
const axios = require("axios");
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key

const router = express.Router();

// Endpoint untuk mengecek status pembayaran
router.get("/", validateApiKey, async (req, res) => {
  const { merchant, keyorkut } = req.query; // Mendapatkan parameter merchant dan keyorkut dari query URL

  // Pastikan merchant dan keyorkut ada dalam query
  if (!merchant || !keyorkut) {
    return res.status(400).json({
      message: "Parameter 'merchant' dan 'keyorkut' harus disertakan.",
    });
  }

  try {
    // Meminta data dari API cek status
    const response = await axios.get(`https://api.abidev.tech/api/orkut/cekstatus?merchant=${merchant}&keyorkut=${keyorkut}`);
    const statusData = response.data;

    // Menghapus data 'author' dari respons
    delete statusData.author;

    // Mengembalikan data dalam format JSON langsung tanpa author
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
