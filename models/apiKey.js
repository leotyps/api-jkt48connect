// models/apiKey.js
const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  expiryDate: { type: Date, required: true },
  remainingRequests: { type: Number, required: true },
  maxRequests: { type: Number, required: true },
  lastAccessDate: { type: Date, required: true },
});

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

module.exports = ApiKey;
