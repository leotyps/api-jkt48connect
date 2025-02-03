const express = require("express");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware for API key validation
const LlamaAI = require("llamaai"); // Import the llamaai module
const fs = require("fs");
const app = express();
const router = express.Router();

// Initialize the LlamaAI client with your API token
const apiToken = 'LA-a9d86fbebb1846a88a02e914376480c87b44d18ae8474413ba17e7162376371e'; // Ganti dengan token API Anda
const llamaAPI = new LlamaAI(apiToken);

// Enable CORS
app.use(
  cors({
    origin: "*",
  })
);

// Middleware to parse JSON request bodies
app.use(express.json({ limit: '10mb' })); // Adjust the limit as needed

// Endpoint for processing user messages and images
router.post("/", validateApiKey, async (req, res) => {
  const userMessage = req.query.chat;
  const imageBase64 = req.query.image;

  try {
    // Load the Llama 3.2-90B-Vision model
    const model = await llamaAPI.loadModel("llama3.2-90b-vision");

    // Define the system role for the AI
    const systemMessage = {
      role: "system",
      content: "Assistant is a large language model trained by OpenAI.",
    };

    // Prepare the messages array
    const messages = [systemMessage];

    // If there's a user message, add it to the messages array
    if (userMessage) {
      messages.push({
        role: "user",
        content: userMessage,
      });
    }

    // If there's an image, process it
    if (imageBase64) {
      const imageBuffer = Buffer.from(imageBase64, "base64");

      // Save the image to a temporary file
      const imagePath = "/tmp/uploaded_image.jpg";
      fs.writeFileSync(imagePath, imageBuffer);

      // Add the image to the user message
      messages.push({
        role: "user",
        content: "Please analyze the attached image.",
        images: [imagePath],
      });
    }

    // Generate the AI's response
    const response = await model.chat(messages);

    // Send the AI's response back to the client
    res.json({
      success: true,
      message: response,
    });
  } catch (error) {
    console.error("Error processing request with AI:", error.message);

    // Return an error response if something goes wrong
    res.status(500).json({
      success: false,
      message: "Failed to process the request with AI.",
      error: error.message,
    });
  }
});

module.exports = router;
