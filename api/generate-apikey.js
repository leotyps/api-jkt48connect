const express = require("express");
const router = express.Router();
const { addApiKey } = require("../apiKeys");
const fs = require("fs");

// Fungsi untuk membuat API key baru
function generateApiKey() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 12;
  let apiKey = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    apiKey += characters[randomIndex];
  }

  return apiKey;
}

// Fungsi untuk menghitung tanggal kedaluwarsa otomatis
function getExpiryDate() {
  const now = new Date();
  now.setDate(now.getDate() + 1); // Tambahkan 1 hari ke tanggal saat ini
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan dimulai dari 0
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year}/${hours}:${minutes}`;
}

// Endpoint untuk membuat API key baru
router.get("/generate-apikey/:generate", (req, res) => {
  const { generate } = req.params;

  if (generate === "true") {
    const newApiKey = generateApiKey();
    const expiryDate = getExpiryDate();

    addApiKey(newApiKey, expiryDate); // Tambahkan API key dengan tanggal kedaluwarsa

    // Simpan API key ke file
    const apiKeys = require("../apiKeys").apiKeys;
    fs.writeFileSync("./apiKeys.json", JSON.stringify(apiKeys, null, 2));

    return res.status(200).json({
      success: true,
      message: "API key berhasil dibuat.",
      apiKey: newApiKey,
      expiryDate,
    });
  }

  // Jika parameter bukan "true", kembalikan respons gagal
  res.status(400).json({
    success: false,
    message: "Parameter generate harus bernilai true untuk membuat API key.",
  });
});

module.exports = router;
