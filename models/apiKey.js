const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  expiryDate: { type: String, required: true },
  remainingRequests: { type: mongoose.Schema.Types.Mixed, required: true },
  maxRequests: { type: mongoose.Schema.Types.Mixed, required: true },
  lastAccessDate: { type: String, required: true },
});

module.exports = mongoose.model("ApiKey", apiKeySchema);
