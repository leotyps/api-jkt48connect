const express = require("express");
const axios = require("axios");
const validateApiKey = require("../middleware/auth"); // Import middleware validasi API key

const router = express.Router();

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
    res.json(paymentData);
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
