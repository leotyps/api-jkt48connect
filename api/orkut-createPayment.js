const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key
const qrisDinamis = require("qris-dinamis"); // Import modul qris-dinamis
const router = express.Router();

// Enable CORS
router.use(
  cors({
    origin: "*",
  })
);

// Endpoint untuk membuat pembayaran QRIS
router.get("/", validateApiKey, async (req, res) => {
  const { amount, qris } = req.query; // Mengambil parameter query

  // Validasi parameter wajib
  if (!amount || !qris) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'qris' harus disertakan.",
    });
  }

  try {
    // Path sementara untuk menyimpan file QRIS
    const tempPath = path.join("/tmp", `qris-${Date.now()}.png`);

    // Membuat file QRIS
    qrisDinamis.makeFile(qris, { nominal: amount, path: tempPath });

    // Membaca file dan mengirimkan sebagai respons
    const fileBuffer = fs.readFileSync(tempPath);

    // Menghapus file setelah membaca
    fs.unlinkSync(tempPath);

    // Mengembalikan QRIS sebagai respons gambar
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", "inline; filename=qris.png");
    res.send(fileBuffer);
  } catch (error) {
    console.error("Error creating QRIS:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal membuat QRIS.",
      error: error.message,
    });
  }
});

module.exports = router;
