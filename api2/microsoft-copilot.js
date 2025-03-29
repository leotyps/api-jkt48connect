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
  const query = req.query.text;

  // Check if query is empty or not provided
  if (!query) {
    return res.json({
      success: true,
      message: "No query provided",
      result: "Please provide a query using the 'text' parameter to get a Copilot response."
    });
  }

  try {
    // Get response from Copilot service
    const response = await chatCopilot(query);

    // Send successful response to client
    res.json({
      success: true,
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
  const query = req.body.text;

  // Check if query is empty or not provided
  if (!query) {
    return res.json({
      success: true,
      message: "No query provided",
      result: "Please provide a query in the request body using the 'text' field to get a Copilot response."
    });
  }

  try {
    // Get response from Copilot service
    const response = await chatCopilot(query);

    // Send successful response to client
    res.json({
      success: true,
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
