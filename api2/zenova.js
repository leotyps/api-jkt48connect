const express = require("express");
const cors = require("cors");
const validateApiKey = require("../middleware/auth");
const LlamaAI = require("llamaai"); // Menggunakan module llamaai

const app = express();
const router = express.Router();

// Enable CORS
app.use(cors({ origin: "*" }));

// Inisialisasi LlamaAI dengan API token Anda
const apiToken = 'LA-a9d86fbebb1846a88a02e914376480c87b44d18ae8474413ba17e7162376371e'; // Ganti dengan token API Anda
const llamaAPI = new LlamaAI(apiToken);

// Endpoint untuk memproses query AI secara realtime
router.get("/", validateApiKey, async (req, res) => {
  const query = req.query.q || "Hallo"; // Query default

  // Siapkan array pesan dengan role system dan user
  const messages = [
    {
      "role": "system",
      "content": "Zenova AI: Assistant is a large language model trained by OpenAI."
    },
    {
      "role": "user",
      "content": query
    }
  ];

  // Bangun objek request sesuai dengan dokumentasi llamaai
  const apiRequestJson = {
    model: "llama3.2-90b-vision",
    messages: messages,
    stream: true, // Aktifkan streaming untuk respon realtime
    // Parameter tambahan seperti max_tokens, temperature, dll. bisa ditambahkan jika diperlukan
  };

  try {
    // Eksekusi request ke LlamaAPI
    const stream = await llamaAPI.run(apiRequestJson);

    // Set header untuk streaming response
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
      console.error(`Error streaming AI response: ${error.message}`);
      res.status(500).json({
        success: false,
        message: `Gagal memproses query untuk ${query}.`,
        error: error.message,
      });
    });
  } catch (error) {
    console.error(`Error processing AI query for query ${query}:`, error.message);
    res.status(500).json({
      success: false,
      message: `Gagal memproses query untuk ${query}.`,
      error: error.message,
    });
  }
});

module.exports = router;
