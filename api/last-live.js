// routes/now-live.js
const express = require("express");
const axios = require("axios");
const LiveData = require("../models/liveDataModel");  // Model untuk menyimpan data ke DB
const router = express.Router();

// Fungsi untuk mengambil dan menyimpan data live ke database
async function fetchAndSaveLiveData() {
  try {
    // Ambil data dari API nowlive
    const response = await axios.get("https://api.crstlnz.my.id/api/now_live?group=jkt48");
    const liveData = response.data;

    // Proses dan simpan data ke database
    for (const live of liveData) {
      // Cek apakah data sudah ada di database
      const existingLiveData = await LiveData.findOne({ name: live.name });
      if (!existingLiveData) {
        // Simpan data baru jika belum ada
        const newLiveData = new LiveData({
          name: live.name,
          img: live.img,
          img_alt: live.img_alt,
          started_at: live.started_at,
          streaming_url: live.streaming_url_list ? live.streaming_url_list[0]?.url : null,
        });
        
        await newLiveData.save();  // Simpan ke database
      }
    }

    console.log("Data berhasil disimpan ke database.");
  } catch (error) {
    console.error("Error fetching and saving live data:", error.message);
  }
}

// Endpoint untuk mengambil data live yang sudah disimpan
router.get("/", async (req, res) => {
  try {
    // Ambil data yang sudah disimpan di database
    const liveDataFromDb = await LiveData.find();

    // Kirim data yang sudah disimpan ke client
    res.json(liveDataFromDb);
  } catch (error) {
    console.error("Error fetching live data from DB:", error.message);
    res.status(500).json({
      message: "Gagal mengambil data live dari database.",
      error: error.message,
    });
  }
});

// Endpoint untuk memicu pengambilan dan penyimpanan data secara manual
router.get("/fetch", async (req, res) => {
  await fetchAndSaveLiveData();
  res.json({ message: "Data sedang diambil dan disimpan." });
});

module.exports = router;
