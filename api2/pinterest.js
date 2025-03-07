const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/premium"); // Middleware API key

const router = express.Router();

// Enable CORS
router.use(cors({
  origin: "*",
}));

// Fungsi untuk mengambil data dari Pinterest
async function fetchPinterestResults(query) {
  const url = `https://id.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${encodeURIComponent(query)}%26rs%3Dtyped&data=%7B%22options%22%3A%7B%22query%22%3A%22${encodeURIComponent(query)}%22%2C%22scope%22%3A%22pins%22%7D%2C%22context%22%3A%7B%7D%7D`;

    const headers = {
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    'priority': 'u=1, i',
    'referer': 'https://id.pinterest.com/',
    'screen-dpr': '1',
    'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133")',
    'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Google Chrome";v="133.0.6943.142", "Chromium";v="133.0.6943.142")',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-model': '""',
    'sec-ch-ua-platform': '"Windows"',
    'sec-ch-ua-platform-version': '"10.0.0"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    'x-app-version': 'c056fb7',
    'x-pinterest-appstate': 'active',
    'x-pinterest-pws-handler': 'www/index.js',
    'x-pinterest-source-url': '/',
    'x-requested-with': 'XMLHttpRequest'
  };

  try {
    const response = await axios.get(url, { headers });

    if (response.data?.resource_response?.data?.results) {
      return response.data.resource_response.data.results
        .map(item => ({
          pin: `https://www.pinterest.com/pin/${item.id ?? ''}`,
          images_url: item.images?.['736x']?.url ?? '',
          grid_title: item.grid_title ?? 'Tanpa Judul'
        }))
        .filter(img => img.images_url); // Hanya ambil hasil yang memiliki gambar
    }

    return [];
  } catch (error) {
    console.error("Pinterest Scraper Error:", error.message);
    return [];
  }
}

// Endpoint API
router.get("/", validateApiKey, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      message: "Parameter 'query' diperlukan.",
    });
  }

  try {
    const results = await fetchPinterestResults(query);

    if (results.length === 0) {
      return res.status(404).json({
        message: "Tidak ditemukan hasil untuk query tersebut.",
      });
    }

    res.json(results);
  } catch (error) {
    console.error("Error processing Pinterest data:", error.message);
    res.status(500).json({
      message: "Gagal mengambil data dari Pinterest.",
      error: error.message,
    });
  }
});

module.exports = router;
