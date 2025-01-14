const express = require("express");
const cors = require("cors");
const axios = require("axios");
const validateApiKey = require("../middleware/auth");
const qrisDinamis = require("qris-dinamis");
const FormData = require("form-data");
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
    // Membuat QRIS dalam bentuk Buffer
    const buffer = qrisDinamis.makeBuffer(qris, { nominal: amount });

    // Buat FormData untuk upload ke Catbox
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", buffer, { filename: "qris.png", contentType: "image/png" });

    // Mengirim file ke Catbox
    const response = await axios.post("https://catbox.moe/user/api.php", formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

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
