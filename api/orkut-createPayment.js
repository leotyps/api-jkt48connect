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

// Endpoint untuk membuat pembayaran
router.get("/", validateApiKey, async (req, res) => {
  const { amount, codeqr, logostore } = req.query; // Mendapatkan parameter amount, codeqr, dan logostore dari query URL

  // Pastikan amount dan codeqr ada dalam query
  if (!amount || !codeqr) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'codeqr' harus disertakan.",
    });
  }

  try {
    // Membentuk URL berdasarkan apakah logostore disertakan atau tidak
    const apiUrl = `https://apiv2.abidev.tech/api/orkut/createpayment?amount=${amount}&codeqr=${codeqr}${
      logostore ? `&logostore=${encodeURIComponent(logostore)}` : ""
    }`;

    // Meminta data dari API pembayaran
    const response = await axios.get(apiUrl);
    const paymentData = response.data;

    // Menghapus data 'creator' dari respons
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
