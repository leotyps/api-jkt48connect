const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key

const router = express.Router();

// Enable CORS untuk semua domain
router.use(cors({ origin: "*" }));

// Fungsi untuk mendapatkan ID YouTube dari URL
const GetIdYoutube = (url) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    if (hostname === "youtu.be") {
      return urlObj.pathname.substring(1);
    }

    if (
      hostname.includes("youtube.com") &&
      (urlObj.pathname.startsWith("/watch") || urlObj.searchParams.has("v"))
    ) {
      return urlObj.searchParams.get("v");
    }

    const match = urlObj.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
    if (match) return match[2];

    return null;
  } catch {
    return null;
  }
};

// Endpoint utama untuk konversi YouTube ke MP3
router.get("/", validateApiKey, async (req, res) => {
  const { url } = req.query; // Ambil URL dari query parameter

  if (!url) return res.status(400).end();

  try {
    const idYt = GetIdYoutube(url);
    if (!idYt) return res.status(400).end();

    // Ambil informasi video
    const { data: info } = await axios.get(`https://c01-h01.cdnframe.com/api/v4/info/${idYt}`);
    if (!info || !info.formats?.audio?.mp3?.length) return res.status(400).end();

    const { title, thumbnail, formats } = info;
    const token = formats.audio.mp3[0].token;

    // Mulai konversi
    const { data: convertData } = await axios.post(
      "https://c01-h01.cdnframe.com/api/v4/convert",
      { token },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    );

    if (!convertData?.id) return res.status(500).end();

    let statusData;
    do {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Delay 2 detik sebelum request berikutnya

      const { data } = await axios.get(`https://c01-h01.cdnframe.com/api/v4/status/${convertData.id}`);
      statusData = data;
    } while (!statusData.download);

    // Return data murni tanpa tambahan teks
    res.json({
      title,
      thumbnail,
      audio_url: statusData.download,
    });
  } catch {
    res.status(500).end();
  }
});

module.exports = router;
