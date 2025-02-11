const express = require("express");

const router = express.Router();

// Cache untuk menyimpan data sementara
let cacheData = null;
let cacheTimestamp = null;
const cacheDuration = 30 * 1000; // 30 detik dalam milidetik

// Endpoint untuk welcome message dan menerima data
router.get("/", (req, res) => {
  // Cek apakah data dalam cache masih berlaku
  const now = Date.now();
  if (cacheData && (now - cacheTimestamp) < cacheDuration) {
    // Tampilkan data yang ada dalam cache jika masih berlaku
    return res.json({
      success: true,
      message: "Data terbaru dalam cache",
      data: cacheData,
    });
  }

  // Ambil data dari query parameter jika ada
  const { owner, ip, nama } = req.query;

  if (owner || ip || nama) {
    // Simpan data baru ke dalam cache
    cacheData = { owner, ip, nama };
    cacheTimestamp = now;

    return res.json({
      success: true,
      message: "Data diterima dan disimpan untuk 30 detik.",
      data: cacheData,
    });
  }

  // Jika tidak ada query parameter, tampilkan welcome message
  res.json({
    success: true,
    message: "Selamat datang di API JKT48Connect! Ini adalah source api untuk website www.jkt48connect.my.id",
    owner: "Valzy",
    developer: "Valzyy",
    social_media: {
      instagram: "@valzy._",
      tiktok: "@valzyycans",
      youtube: "@valzyofc"
    },
  });
});

module.exports = router;
