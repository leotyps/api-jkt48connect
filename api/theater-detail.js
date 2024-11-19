const express = require("express");
const axios = require("axios");

const router = express.Router();

// Endpoint untuk mengambil data theater berdasarkan ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Mendapatkan ID dari parameter URL

  try {
    // Meminta data dari API berdasarkan ID
    const response = await axios.get(`https://api.crstlnz.my.id/api/theater/${id}`);
    const theaterDetail = response.data;

    // Mengembalikan data dalam bentuk JSON
    res.json({
      success: true,
      author: `Valzyy`,
      data: theaterDetail,
    });
  } catch (error) {
    console.error(`Error fetching theater detail with ID ${id}:`, error.message);

    // Mengembalikan error response jika terjadi kesalahan
    res.status(500).json({
      success: false,
      message: `Gagal mengambil data theater dengan ID ${id}.`,
      error: error.message,
    });
  }
});

module.exports = router;
