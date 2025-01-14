const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const validateApiKey = require("../middleware/auth");
const qrisDinamis = require("qris-dinamis");
const router = express.Router();

// Enable CORS
router.use(
  cors({
    origin: "*",
  })
);

// Endpoint untuk membuat pembayaran QRIS
router.get("/", validateApiKey, async (req, res) => {
  const { amount, qris } = req.query;

  // Validasi parameter wajib
  if (!amount || !qris) {
    return res.status(400).json({
      message: "Parameter 'amount' dan 'qris' harus disertakan.",
    });
  }

  try {
    // Path sementara untuk menyimpan file QRIS
    const tempDir = "/tmp";
    const tempPath = path.join(tempDir, `qris-${Date.now()}.png`);

    // Pastikan folder /tmp ada
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Membuat file QRIS
    qrisDinamis.makeFile(qris, { nominal: amount, path: tempPath });

    // Baca file QRIS yang telah dibuat
    const fileBuffer = fs.readFileSync(tempPath);

    // Upload file ke Catbox
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", fs.createReadStream(tempPath));

    const response = await axios.post("https://catbox.moe/user/api.php", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Hapus file lokal setelah diunggah
    fs.unlinkSync(tempPath);

    // Kirim URL hasil upload ke Catbox sebagai respons
    res.json({
      author: "Valzyy",
      message: "QRIS berhasil dibuat.",
      catboxUrl: response.data, // URL hasil unggahan Catbox
    });
  } catch (error) {
    console.error("Error creating or uploading QRIS:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal membuat QRIS.",
      error: error.message,
    });
  }
});

module.exports = router;
