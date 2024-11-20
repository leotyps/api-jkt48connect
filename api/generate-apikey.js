const express = require("express");
const router = express.Router();
const { addApiKey } = require("../apiKeys");
const fs = require("fs");

// Fungsi untuk membuat API key baru
function generateApiKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 10;
  let apiKey = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    apiKey += characters[randomIndex];
  }

  return apiKey;
}

// Endpoint untuk membuat API key baru
router.get("/generate-apikey", (req, res) => {
  const currentDate = new Date();
  const expiryDate = new Date(currentDate);
  expiryDate.setDate(currentDate.getDate() + 1); // Set masa aktif API key menjadi 1 hari

  const newApiKey = generateApiKey();

  // Menambahkan API key yang baru ke dalam apiKeys
  addApiKey(newApiKey, expiryDate.toISOString());

  // Simpan API key ke file
  const apiKeys = require("../apiKeys").apiKeys;
  fs.writeFileSync("./apiKeys.json", JSON.stringify(apiKeys, null, 2));

  // Mengembalikan response yang berisi API key dan masa aktifnya
  res.status(200).json({
    success: true,
    message: "API key berhasil dibuat.",
    apiKey: newApiKey,
    expiryDate: expiryDate.toLocaleString(), // Format tanggal dalam format lokal
  });
});

module.exports = router;
