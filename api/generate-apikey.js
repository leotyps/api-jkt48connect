const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const simpleGit = require("simple-git");

//const GITHUB_TOKEN = "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";  // Ganti dengan token GitHub Anda
const GITHUB_TOKEN = "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"; // Ganti dengan token GitHub Anda
const REPO_OWNER = "Apalahdek";  // Ganti dengan nama pengguna GitHub Anda
const REPO_NAME = "api-jkt48connect";  // Ganti dengan nama repositori Anda
const FILE_PATH = "apiKeys.js"; // Path file yang ingin dimodifikasi
const COMMIT_MESSAGE = "Automated commit to add new API key"; // Pesan commit

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

// Fungsi untuk mengupdate file apiKeys.js di GitHub
async function updateFileOnGitHub(apiKey, expiryDate) {
  const apiKeysTemplate = `
const parseCustomDate = require("./helpers/dateParser");

const apiKeys = {
  "${apiKey}": parseCustomDate("${expiryDate}"),
};

module.exports = apiKeys;
`;

  // Ambil sha (hash) file apiKeys.js saat ini dari GitHub
  const getFileSha = await axios.get(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
  });

  const sha = getFileSha.data.sha;  // Ambil sha dari file

  // Kirim permintaan untuk mengupdate file dengan SHA file
  const response = await axios.put(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
    {
      message: COMMIT_MESSAGE,
      content: Buffer.from(apiKeysTemplate).toString("base64"),
      sha: sha,
    },
    {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
      },
    }
  );

  return response.data;
}

// Endpoint untuk membuat API key baru dan update file di GitHub
const express = require("express");
const router = express.Router();

router.get("/generate-apikey", async (req, res) => {
  try {
    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setDate(currentDate.getDate() + 1); // Set masa aktif API key menjadi 1 hari

    const newApiKey = generateApiKey();

    // Update file apiKeys.js di GitHub
    const result = await updateFileOnGitHub(newApiKey, expiryDate.toISOString());

    res.status(200).json({
      success: true,
      message: "API key berhasil dibuat dan perubahan telah di-push ke GitHub.",
      apiKey: newApiKey,
      expiryDate: expiryDate.toLocaleString(), // Format tanggal dalam format lokal
      result,
    });
  } catch (error) {
    console.error("Error during API key generation and GitHub update:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengenerate API key dan push perubahan ke GitHub.",
      error: error.message || "Unknown error",
    });
  }
});

module.exports = router;
