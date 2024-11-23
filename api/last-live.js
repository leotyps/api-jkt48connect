const express = require("express");
const axios = require("axios");
const LiveData = require("../models/LiveData");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key

const router = express.Router();

// Fungsi untuk mengambil data dari API member
async function fetchLastLiveData(memberName) {
  try {
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

    // Proses setiap data yang ditemukan
    for (const live of liveData) {
      const { name, img, img_alt } = live;

      // Cek apakah data sudah ada di database
      let existingData = await LiveData.findOne({ name });

      if (!existingData) {
        // Ambil last_live jika belum ada
        const lastLiveData = await fetchLastLiveData(name);

        // Simpan data baru ke database
        existingData = new LiveData({
          name,
          img,
          img_alt,
          last_live: lastLiveData,
        });

        await existingData.save();
      }
    }

    // Ambil semua data dari database untuk ditampilkan
    const allLiveData = await LiveData.find();

    res.json(allLiveData);
  } catch (error) {
    console.error("Error fetching or processing live data:", error.message);
    res.status(500).json({
      message: "Gagal mengambil atau menyimpan data live.",
      error: error.message,
    });
  }
});

module.exports = router;
