const express = require("express");
const router = express.Router();
const cors = require('cors');
const { Client } = require('pg'); // Import PostgreSQL Client
const app = express(); // Inisialisasi express app

// Koneksi ke database PostgreSQL
const dbClient = new Client({
  connectionString: 'postgresql://jkt48connect_apikey:vAgy5JNXz4woO46g8fho4g@jkt48connect-7018.j77.aws-ap-southeast-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full',
});

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*', // Atau set domain spesifik, misalnya 'https://yourfrontenddomain.com'
}));

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

// Endpoint untuk mengambil semua data API key
router.get("/all-apikeys", async (req, res) => {
  try {
    // Koneksi ke database
    await dbClient.connect();
    
    // Query untuk mengambil semua data API key
    const result = await dbClient.query("SELECT * FROM api_keys");
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada data API key ditemukan.",
      });
    }

    // Map data API key dan format sesuai kebutuhan
    const apiKeysData = result.rows.map(row => ({
      api_key: row.api_key,
      expiry_date: formatDate(row.expiry_date),
      remaining_requests: row.remaining_requests === "∞" ? "∞" : row.remaining_requests,
      max_requests: row.max_requests === "∞" ? "∞" : row.max_requests,
      seller: row.seller || false,
      premium: row.premium || false,
      last_access_date: formatDate(row.last_access_date),
    }));

    // Kirimkan semua data API key sebagai response
    res.status(200).json({
      success: true,
      message: "Data API keys berhasil diambil.",
      data: apiKeysData,
    });
  } catch (error) {
    console.error("Error fetching all API keys:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data API key.",
    });
  } finally {
    // Menutup koneksi ke database
    await dbClient.end();
  }
});

module.exports = router;
