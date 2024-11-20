const express = require("express");
const router = express.Router();
const apiKeys = require("../apiKeys"); // File yang berisi daftar API key dan tanggal kedaluwarsa

// Endpoint untuk memeriksa API key
router.post("/check-apikey", (req, res) => {
  const { api_key } = req.body; // Ambil API key dari body request

  if (!api_key) {
    return res.status(400).json({
      success: false,
      message: "API key tidak ditemukan. Harap masukkan API key Anda.",
    });
  }

  const expiryDate = apiKeys[api_key]; // Cari API key di database atau file

  if (!expiryDate) {
    return res.status(403).json({
      success: false,
      message: "API key tidak valid. Silakan beli API key di WhatsApp 6285701479245 atau wa.me/6285701479245.",
    });
  }

  const now = new Date();

  if (now > expiryDate) {
    return res.status(403).json({
      success: false,
      message: "API key sudah kedaluwarsa. Silakan perpanjang API key Anda di WhatsApp 6285701479245 atau wa.me/6285701479245.",
    });
  }

  // Jika API key valid dan belum kedaluwarsa
  res.status(200).json({
    success: true,
    message: "API key valid.",
    expiry_date: expiryDate.toISOString(), // Tanggal kedaluwarsa dalam format ISO
  });
});

module.exports = router;
