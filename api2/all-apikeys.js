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

// Endpoint untuk mengambil semua data API key
router.get("/all-apikeys", async (req, res) => {
  try {
    // Koneksi ke database
    await dbClient.connect();
    
    // Query untuk mengambil semua data API key
    const result = await dbClient.query("SELECT * FROM api_keys");
    
    // Jika tidak ada data ditemukan
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tidak ada data API key ditemukan.",
      });
    }

    // Kirimkan semua data API key tanpa perubahan format
    res.status(200).json(result.rows);  // Mengirimkan data mentah dari database
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
