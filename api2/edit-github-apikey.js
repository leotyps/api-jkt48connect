const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // Pastikan dotenv diaktifkan untuk baca .env

const app = express();
const router = express.Router();

app.use(cors({ origin: "*" }));

router.get("/", async (req, res) => {
  const { apiKey, premium } = req.query;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!apiKey) {
    return res.status(400).json({
      message: "Parameter 'apiKey' harus disertakan.",
    });
  }

  if (!githubToken) {
    return res.status(500).json({
      message: "Token GitHub tidak ditemukan di environment variable.",
    });
  }

  try {
    // Susun URL dengan parameter dinamis
    let url = `https://backend.jkt48connect.my.id/api/auth/edit-github-apikey?githubToken=${githubToken}&apiKey=${apiKey}`;
    if (premium) {
      url += `&premium=${premium}`;
    }

    // Fetch data
    const response = await axios.get(url);
    const data = response.data;

    res.json(data);
  } catch (error) {
    console.error("Gagal mengambil data dari API:", error.message);
    res.status(500).json({
      message: "Gagal memproses permintaan.",
      error: error.message,
    });
  }
});

module.exports = router;
