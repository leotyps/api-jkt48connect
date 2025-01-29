const express = require("express");
const router = express.Router();
const cors = require('cors');
const { Client } = require('pg'); // Import PostgreSQL Client
const app = express(); // Inisialisasi express app

// Koneksi ke database PostgreSQL
const dbClient = new Client({
  connectionString: 'postgresql://jkt48connect_apikey:vAgy5JNXz4woO46g8fho4g@jkt48connect-7018.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
});

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
  origin: '*', // Atau set domain spesifik, misalnya 'https://yourfrontenddomain.com'
}));

// Endpoint untuk memeriksa API key
router.get("/check-apikey/:api_key", async (req, res) => {
  const { api_key } = req.params; // Ambil API key dari path parameter

  if (!api_key) {
    return res.status(400).json({
      success: false,
      message: "API key tidak ditemukan. Harap masukkan API key Anda.",
    });
  }

  try {
    // Koneksi ke database
    await dbClient.connect();
    
    // Query untuk mencari API key di database
    const result = await dbClient.query(
      "SELECT * FROM api_keys WHERE api_key = $1",
      [api_key]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "API key tidak aktif. Silakan aktivasi API key terlebih di WhatsApp 6285701479245 atau chatbox pada Dashboard.",
      });
    }

    const keyData = result.rows[0]; // Ambil data API key dari hasil query

    const now = new Date();
    const today = getTodayDate();

    // Periksa apakah API key sudah kedaluwarsa
    if (keyData.expiry_date !== "unli" && keyData.expiry_date !== "-" && now > keyData.expiry_date) {
      return res.status(403).json({
        success: false,
        message: `API key sudah kedaluwarsa. Silakan perpanjang API key Anda di WhatsApp 6285701479245 atau wa.me/6285701479245.`,
      });
    }

    // Reset limit request jika hari terakhir berbeda dari hari ini
    if (keyData.last_access_date !== today) {
      await dbClient.query(
        "UPDATE api_keys SET remaining_requests = $1, last_access_date = $2 WHERE api_key = $3",
        [keyData.max_requests === "∞" ? "∞" : keyData.max_requests, today, api_key]
      );
    }

    // Periksa limit request
    if (keyData.remaining_requests === "∞") {
      return res.status(200).json({
        success: true,
        message: "API key valid.",
        expiry_date: formatDate(keyData.expiry_date), // Tanggal kedaluwarsa diformat
        remaining_requests: "∞", // Limit tak terbatas
        max_requests: "∞", // Limit tak terbatas
        seller: keyData.seller || false, // Kembalikan informasi seller
        premium: keyData.premium || false, // Kembalikan informasi premium
      });
    }

    if (keyData.remaining_requests <= 0) {
      return res.status(429).json({
        success: false,
        message: "Batas request API key Anda telah habis untuk hari ini. Silakan tunggu hingga besok atau hubungi WhatsApp 6285701479245.",
      });
    }

    // Jika API key valid, belum kedaluwarsa, dan limit masih tersedia
    res.status(200).json({
      success: true,
      message: "API key valid.",
      expiry_date: formatDate(keyData.expiry_date), // Tanggal kedaluwarsa diformat
      remaining_requests: keyData.remaining_requests, // Sisa request
      max_requests: keyData.max_requests === "-" ? "∞" : keyData.max_requests, // Limit maksimum
      seller: keyData.seller || false, // Kembalikan informasi seller
      premium: keyData.premium || false, // Kembalikan informasi premium
    });
  } catch (error) {
    console.error("Error checking API key:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat memeriksa API key.",
    });
  } finally {
    // Menutup koneksi ke database
    await dbClient.end();
  }
});

module.exports = router;
