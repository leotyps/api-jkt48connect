const express = require("express");
const { createPaymentString, createPaymentQr } = require("../saweria.js"); // Import modul jkt48connect-saweria
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key
const axios = require("axios");
const app = express();
const router = express.Router();

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*',
}));

// Endpoint untuk membuat pembayaran
router.get("/", validateApiKey, async (req, res) => {
  const { amount, username, message } = req.query; // Mendapatkan parameter amount, username, dan message dari query URL

  // Pastikan amount dan username ada dalam query
  if (!amount || !username) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'username' harus disertakan.",
    });
  }

  try {
    // Menambahkan headers khusus untuk menghindari error 403
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3', 
      'Authorization': 'Bearer JKTCONNECT' // Ganti dengan token API yang benar jika diperlukadiperluk// Ganti dengan API key Anda jika diperlukan
    }  
  };

    // Memanggil fungsi createPaymentQr dari modul jkt48connect-saweria untuk membuat pembayaran
    const result = await createPaymentQr(username, { 
      amount: parseInt(amount), 
      message, 
      headers // Menambahkan headers ke dalam request
    });

    // Mengembalikan data hasil pembayaran dalam format JSON
    res.json({
      author: "Valzyy",
      ...result, // Menyisipkan data hasil pembayaran langsung dari modul
    });
  } catch (error) {
    console.error("Error creating payment:", error.message);
    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal membuat pembayaran.",
      error: error.message,
    });
  }
});

module.exports = router;
