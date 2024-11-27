const express = require("express");
const axios = require("axios");
const cors = require('cors');
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key

const router = express.Router();


// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: '*', // Atau set domain spesifik, misalnya 'https://yourfrontenddomain.com'
}));

// Endpoint untuk membuat pembayaran
router.get("/", validateApiKey, async (req, res) => {
  const { amount, codeqr } = req.query; // Mendapatkan parameter amount dan codeqr dari query URL

  // Pastikan amount dan codeqr ada dalam query
  if (!amount || !codeqr) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'codeqr' harus disertakan.",
    });
  }

  try {
    // Meminta data dari API pembayaran
    const response = await axios.get(`https://api.abidev.tech/api/orkut/createpayment?amount=${amount}&codeqr=${codeqr}`);
    const paymentData = response.data;

    // Menghapus data 'author' dari respons
    delete paymentData.creator;

    // Mengembalikan data dalam format JSON langsung tanpa author
    res.json({
      author: "Valzyy",
      ...paymentData, // Menyisipkan data pembayaran langsung
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
