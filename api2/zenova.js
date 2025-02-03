const express = require("express");
const cors = require("cors");
const LlamaAI = require("llamaai");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key, tidak diubah
const serverless = require("serverless-http");

// Buat router Express
const router = express.Router();

// Inisialisasi LlamaAI dengan API token dari environment variable
const apiToken = 'LA-a9d86fbebb1846a88a02e914376480c87b44d18ae8474413ba17e7162376371e'; // Ganti dengan token API Anda
const llamaAPI = new LlamaAI(apiToken);

// Endpoint untuk memproses query AI secara realtime
router.get("/", validateApiKey, async (req, res) => {
  const query = req.query.q || "hallo";

  // Siapkan pesan untuk LlamaAPI, dengan pesan sistem yang menyatakan bahwa AI bernama Zenova AI
  const messages = [
    {
      role: "system",
      content: "Zenova AI: Assistant is a large language model trained by OpenAI."
    },
    {
      role: "user",
      content: query
    }
  ];

  // Bangun objek request sesuai dengan dokumentasi llamaai
  const apiRequestJson = {
    model: "llama3.2-90b-vision",
    messages,
    stream: true // Aktifkan streaming untuk respon realtime
    // Parameter tambahan (misalnya: max_tokens, temperature) dapat ditambahkan jika diperlukan
  };

  try {
    // Eksekusi request ke LlamaAPI
    const stream = await llamaAPI.run(apiRequestJson);

    // Set header untuk streaming (Event Stream)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Streaming data secara realtime ke client
    stream.on("data", (chunk) => {
      res.write(chunk);
    });

    stream.on("end", () => {
      res.end();
    });

    stream.on("error", (error) => {
      console.error("Error streaming AI response:", error.message);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: `Gagal memproses query ${query}.`,
          error: error.message,
        });
      } else {
        res.end();
      }
    });
  } catch (error) {
    console.error("Error processing AI query:", error.message);
    res.status(500).json({
      success: false,
      message: `Gagal memproses query ${query}.`,
      error: error.message,
    });
  }
});

// Buat instance Express app dan gunakan router
const app = express();
app.use(cors({ origin: "*" }));
app.use("/", router);

// Ekspor handler serverless agar kompatibel dengan Vercel
module.exports = serverless(app);
