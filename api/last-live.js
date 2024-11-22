const express = require("express");
const axios = require("axios");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key

const router = express.Router();

// Variabel untuk menyimpan cache data now_live sebelumnya
let liveDataCache = [];

// Fungsi untuk mengambil data last_live dari API member
async function fetchLastLiveData(memberName) {
  try {
    const normalizedMemberName = memberName.toLowerCase(); // Konversi nama menjadi huruf kecil
    const response = await axios.get(`https://api.crstlnz.my.id/api/member/${normalizedMemberName}`);
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
    // Ambil data dari API now_live saat ini
    const response = await axios.get("https://api.crstlnz.my.id/api/now_live?group=jkt48");
    const currentLiveData = response.data;

    // Dapatkan nama dari data yang sekarang live
    const currentLiveNames = currentLiveData.map((live) => live.name);

    // Cari member yang ada di cache tapi sudah hilang dari now_live
    const missingMembers = liveDataCache.filter((cacheItem) => !currentLiveNames.includes(cacheItem.name));

    // Proses untuk setiap member yang hilang (selalu tampilkan meskipun masih ada member live)
    const processedMissingMembers = await Promise.all(
      missingMembers.map(async (member) => {
        const lastLiveData = await fetchLastLiveData(member.name);

        return {
          name: member.name,
          img: member.img,
          img_alt: member.img_alt,
          last_live: lastLiveData || null, // Tampilkan last_live jika ada, jika tidak null
        };
      })
    );

    // Perbarui cache dengan data now_live yang baru
    liveDataCache = currentLiveData.map((live) => ({
      name: live.name,
      img: live.img,
      img_alt: live.img_alt,
    }));

    // Gabungkan data yang hilang dan yang masih live
    const combinedData = [
      ...processedMissingMembers,
      ...currentLiveData.map((live) => ({
        name: live.name,
        img: live.img,
        img_alt: live.img_alt,
        last_live: null, // Jika member masih live, last_live adalah null
      })),
    ];

    // Kembalikan semua data yang diproses
    res.json(combinedData);

  } catch (error) {
    console.error("Error fetching or processing live data:", error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      message: "Gagal mengambil data live atau memproses last live data.",
      error: error.message,
    });
  }
});

module.exports = router;
