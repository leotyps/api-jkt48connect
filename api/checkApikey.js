const express = require("express");
const router = express.Router();
const cors = require('cors');
const apiKeys = require("../apiKeys"); // File yang berisi daftar API key, tanggal kedaluwarsa, dan limit request

// Fungsi untuk format tanggal seperti "Sabtu 12 Agustus 2024 jam 12:00"
function formatDate(date) {
  if (date === "-" || date === "unli") return "∞"; // Jika tanggal tidak terbatas, kembalikan simbol ∞
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Intl.DateTimeFormat("id-ID", options).format(date);
}

// Fungsi untuk mendapatkan tanggal hari ini (tanpa waktu)
function getTodayDate() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}


// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*', 
}));
// Endpoint untuk memeriksa API key
router.get("/check-apikey/:api_key", (req, res) => {
  const { api_key } = req.params; // Ambil API key dari path parameter

  if (!api_key) {
    return res.status(400).json({
      success: false,
      message: "API key tidak ditemukan. Harap masukkan API key Anda.",
    });
  }

  const keyData = apiKeys[api_key]; // Cari API key di database atau file

  if (!keyData) {
    return res.status(403).json({
      success: false,
      message: "API key tidak valid. Silakan beli API key di WhatsApp 6285701479245 atau wa.me/6285701479245.",
    });
  }

  const now = new Date();
  const today = getTodayDate();

  // Periksa apakah API key sudah kedaluwarsa
  if (keyData.expiryDate !== "unli" && keyData.expiryDate !== "-" && now > keyData.expiryDate) {
    return res.status(403).json({
      success: false,
      message: `API key sudah kedaluwarsa. Silakan perpanjang API key Anda di WhatsApp 6285701479245 atau wa.me/6285701479245.`,
    });
  }

  // Reset limit request jika hari terakhir berbeda dari hari ini
  if (keyData.lastAccessDate !== today) {
    keyData.remainingRequests = keyData.maxRequests === "∞" ? "∞" : keyData.maxRequests; // Reset ke limit maksimum
    keyData.lastAccessDate = today; // Update tanggal terakhir akses
  }

  // Periksa limit request
  if (keyData.remainingRequests === "∞") {
    // Jika limit tidak terbatas, lanjutkan tanpa pengurangan request
    return res.status(200).json({
      success: true,
      message: "API key valid.",
      expiry_date: formatDate(keyData.expiryDate), // Tanggal kedaluwarsa diformat
      remaining_requests: "∞", // Limit tak terbatas
      max_requests: "∞", // Limit tak terbatas
    });
  }

  if (keyData.remainingRequests <= 0) {
    return res.status(429).json({
      success: false,
      message: "Batas request API key Anda telah habis untuk hari ini. Silakan tunggu hingga besok atau hubungi WhatsApp 6285701479245.",
    });
  }

  // Jika API key valid, belum kedaluwarsa, dan limit masih tersedia
  res.status(200).json({
    success: true,
    message: "API key valid.",
    expiry_date: formatDate(keyData.expiryDate), // Tanggal kedaluwarsa diformat
    remaining_requests: keyData.remainingRequests, // Sisa request
    max_requests: keyData.maxRequests === "-" ? "∞" : keyData.maxRequests, // Limit maksimum
  });
});

module.exports = router;
