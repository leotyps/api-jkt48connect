const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const simpleGit = require("simple-git");

const GITHUB_TOKEN = "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";  // Ganti dengan token GitHub Anda
const REPO_OWNER = "Apalahdek";  // Ganti dengan nama pengguna GitHub Anda
const REPO_NAME = "api-jkt48connect";  // Ganti dengan nama repositori Anda
const FILE_PATH = path.resolve(__dirname, "../apiKeys.js");  // Pastikan path ini sesuai dengan folder Anda

// Fungsi untuk membuat API key baru
function generateApiKey() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 12;
  let apiKey = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    apiKey += characters[randomIndex];
  }

  return apiKey;
}

// Fungsi untuk menambahkan API key ke dalam apiKeys.js
function addApiKeyToFile(apiKey, expiryDate) {
  const apiKeysFilePath = path.resolve(__dirname, FILE_PATH);
  const apiKeysTemplate = `
const parseCustomDate = require("./helpers/dateParser");

const apiKeys = {
  "${apiKey}": parseCustomDate("${expiryDate}"),
};

module.exports = apiKeys;
`;

  // Menulis ulang file apiKeys.js dengan API key baru
  fs.writeFileSync(apiKeysFilePath, apiKeysTemplate, "utf8");
}

// Fungsi untuk melakukan commit dan push perubahan ke GitHub
async function commitAndPushChanges() {
  const git = simpleGit();

  // Commit perubahan di file
  await git.add(FILE_PATH);
  await git.commit("Automated commit to add new API key");

  // Push perubahan ke repository GitHub
  await git.push("origin", "main");  // Sesuaikan dengan branch yang Anda gunakan
}

// Endpoint untuk membuat API key baru
router.get("/generate-apikey", async (req, res) => {
  try {
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setDate(currentDate.getDate() + 1); // Set masa aktif API key menjadi 1 hari

    const newApiKey = generateApiKey();

    // Menambahkan API key yang baru ke dalam apiKeys.js
    addApiKeyToFile(newApiKey, expiryDate.toISOString());

    // Push perubahan ke GitHub
    await commitAndPushChanges();

    // Mengembalikan response yang berisi API key dan masa aktifnya
    res.status(200).json({
      success: true,
      message: "API key berhasil dibuat dan perubahan telah di-push ke GitHub.",
      apiKey: newApiKey,
      expiryDate: expiryDate.toLocaleString(), // Format tanggal dalam format lokal
    });
  } catch (error) {
    console.error("Error during API key generation and GitHub push:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengenerate API key dan push perubahan ke GitHub.",
      error: error.message || "Unknown error",
    });
  }
});

module.exports = router;
