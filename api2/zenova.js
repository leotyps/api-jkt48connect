const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware for API key validation
const app = express();
const router = express.Router();

// Enable CORS
app.use(
  cors({
    origin: "*",
  })
);

// Endpoint to process text and optional base64-encoded image
router.get("/", validateApiKey, async (req, res) => {
  const text = req.query.text;
  const base64Image = req.query.image; // Optional base64-encoded image

  if (!text) {
    return res.status(400).json({
      success: false,
      message: "The 'text' query parameter is required.",
    });
  }

  try {
    // Decode the base64 image if provided
    let imageBuffer = null;
    if (base64Image) {
      const matches = base64Image.match(/^data:(.+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({
          success: false,
          message: "Invalid base64 image format.",
        });
      }
      const imageType = matches[1];
      const imageData = matches[2];
      imageBuffer = Buffer.from(imageData, "base64");
    }

    // Fetch data from the external API
    const apiUrl = `https://api.siputzx.my.id/api/ai/llama33?prompt=Namamu%20adalah%20Zenova%2C%20asisten%20di%20sini%20buat%20bantuin%20pengguna%20pake%20Zenova%20di%20WhatsApp.%20%0APenciptamu%20adalah%20JKT48Connect%20Corp%2C%20yang%20dibuat%20sama%20Valzyy.%20Zenova%20punya%20lebih%20dari%201000%20fitur%2C%20%0Ayang%20paling%20sering%20dipake%20itu%20%22brat%22%20sama%20fitur%20terbaru%20%22Live%20Notifications%20JKT48%22.%20%0AJawab%20dengan%20santai%2C%20jangan%20pake%20bahasa%20baku%2C%20dan%20selalu%20siap%20bantu%20pengguna.&text=${encodeURIComponent(
      text
    )}`;
    const response = await axios.get(apiUrl);

    // Process the response as needed
    const apiData = response.data;

    // Example: If the API returns an image URL and you want to fetch and send it
    if (apiData.imageUrl) {
      const imageResponse = await axios.get(apiData.imageUrl, {
        responseType: "arraybuffer",
      });
      const contentType = imageResponse.headers["content-type"];
      res.set("Content-Type", contentType);
      return res.send(imageResponse.data);
    }

    // If no image is returned, send the API data as JSON
    res.json({
      success: true,
      data: apiData,
      imageBuffer: imageBuffer ? imageBuffer.toString("base64") : null,
    });
  } catch (error) {
    console.error(`Error processing request:`, error.message);
    res.status(500).json({
      success: false,
      message: "Failed to process the request.",
      error: error.message,
    });
  }
});

module.exports = router;
