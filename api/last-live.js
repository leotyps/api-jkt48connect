const express = require("express");
const axios = require("axios");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key

const router = express.Router();

// Variabel untuk menyimpan data agar tidak hilang
let liveDataCache = [];

// Fungsi untuk mengambil data dari API member dengan memberName lowercase
async function fetchLastLiveData(memberName) {
  try {
    // Ubah memberName menjadi lowercase
    const lowerCaseName = memberName.toLowerCase();
    const response = await axios.get(`https://api.crstlnz.my.id/api/member/${lowerCaseName}`);
    const { last_live } = response.data;
    return last_live;
  } catch (error) {
    console.error(`Error fetching last live data for ${memberName}:`, error.message);
    return null; // Jika gagal, kembalikan null
  }
}

// Endpoint utama
router.get("/", validateApiKey, async (req, res) => {
  try {
    // Ambil data dari API now_live
    const response = await axios.get("https://api.crstlnz.my.id/api/now_live?group=jkt48");
    const liveData = response.data;

    // Proses data untuk setiap live yang ditemukan
    const processedData = await Promise.all(
      liveData.map(async (live) => {
        const { name, img, img_alt } = live;

        // Cek apakah ada di cache atau ambil last_live baru
        const cachedItem = liveDataCache.find((item) => item.name === name);
        const lastLiveData = cachedItem?.last_live || (await fetchLastLiveData(name));

        // Simpan ke cache jika belum ada
        if (!cachedItem && lastLiveData) {
          liveDataCache.push({ name, img, img_alt, last_live: lastLiveData });
        }

        return {
          name,
          img,
          img_alt,
          last_live: lastLiveData || null,
        };
      })
    );

    // Perbarui cache dengan data yang sudah diproses
    liveDataCache = liveDataCache.filter((cacheItem) =>
      processedData.some((data) => data.name === cacheItem.name)
    );

    // Kembalikan hasil akhir
    res.json(processedData);
  } catch (error) {
    console.error("Error fetching or processing live data:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal mengambil data live dan memproses last live data.",
      error: error.message,
    });
  }
});

module.exports = router;
