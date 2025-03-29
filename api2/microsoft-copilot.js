/**
 * Microsoft-Copilot REST API Feature
 * This module exposes a Microsoft-Copilot like feature through a REST API endpoint
 */

const express = require("express");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware for API key validation
const chatCopilot = require("../src/copilot.js"); // Importing the copilot functionality
const router = express.Router();

// Enable CORS
router.use(
  cors({
    origin: "*",
  })
);

// Endpoint to get responses from the Copilot service
router.get("/", validateApiKey, async (req, res) => {
  const query = req.query.text || "Hello"; // Default query if none provided by user

  try {
    // Get response from Copilot service
    const response = await chatCopilot(query);

    // Send successful response to client
    res.json({
      success: true,
      message: "Copilot response generated successfully",
      result: response
    });
  } catch (error) {
    console.error(`Error generating Copilot response for query "${query}":`, error.message);

    // Return error response if something goes wrong
    res.status(500).json({
      success: false,
      message: `Failed to generate Copilot response for query "${query}".`,
      error: error.message,
    });
  }
});

// POST endpoint alternative for longer queries or when GET is not appropriate
router.post("/", validateApiKey, express.json(), async (req, res) => {
  const query = req.body.text || "Hello"; // Get query from request body

  try {
    // Get response from Copilot service
    const response = await chatCopilot(query);

    // Send successful response to client
    res.json({
      success: true,
      message: "Copilot response generated successfully",
      result: response
    });
  } catch (error) {
    console.error(`Error generating Copilot response for query:`, error.message);

    // Return error response if something goes wrong
    res.status(500).json({
      success: false,
      message: "Failed to generate Copilot response.",
      error: error.message,
    });
  }
});

module.exports = router;
