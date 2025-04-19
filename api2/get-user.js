const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const router = express.Router();

// Enable CORS for all domains (or specific domains)
app.use(cors({
  origin: "*",
}));

// Endpoint untuk mengecek status dengan hanya parameter team_id
router.get("/", async (req, res) => {
  const { team_id } = req.query; // Ambil parameter team_id dari query

  // Validasi input query
  if (!team_id) {
    return res.status(400).json({
      message: "Parameter 'team_id' harus disertakan.",
    });
  }

  try {
    // Meminta data dari API JKT48Connect
    const response = await axios.get(`https://backend.jkt48connect.my.id/api/auth/get-user?team_id=${team_id}`);
    const userData = response.data;

    // Kirimkan data murni tanpa tambahan apapun
    res.json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error.message);

    res.status(500).json({
      message: "Gagal mengambil data pengguna.",
      error: error.message,
    });
  }
});

module.exports = router;
