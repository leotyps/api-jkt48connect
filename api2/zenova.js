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
    const apiUrl = `https://api.siputzx.my.id/api/ai/llama33?prompt=namamu%20adalah%20delynai%20dan%20tugas%20mu%20adalah%20sebagai%20asistant&text=${encodeURIComponent(
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
