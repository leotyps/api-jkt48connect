const express = require("express");
const cors = require("cors");
const axios = require("axios");
const validateApiKey = require("../middleware/auth");
const qrisDinamis = require("qris-dinamis");
const FormData = require("form-data");
const fs = require("fs");
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
    // Menyimpan file QRIS sementara dengan makeFile
    const tempFilePath = `/tmp/qris-${Date.now()}.png`;
    qrisDinamis.makeFile(qris, { nominal: amount, path: tempFilePath });

    // Buat FormData untuk upload ke Catbox
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", fs.createReadStream(tempFilePath), { filename: "qris.png" });

    // Mengirim file ke Catbox
    const response = await axios.post("https://catbox.moe/user/api.php", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    // Hapus file sementara setelah diupload
    fs.unlinkSync(tempFilePath);

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
