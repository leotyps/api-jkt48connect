const mongoose = require("mongoose");

// Membuat schema untuk API Key
const apiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  expiryDate: { type: String, required: true },  // Menggunakan String untuk menangani 'unli' dan tanggal
  remainingRequests: { 
    type: mongoose.Schema.Types.Mixed,  // Menggunakan Mixed agar bisa menangani angka atau '∞'
    required: true 
  },
  maxRequests: { 
    type: mongoose.Schema.Types.Mixed,  // Menggunakan Mixed agar bisa menangani angka atau '∞'
    required: true 
  },
  lastAccessDate: { type: Date, required: true },
});

// Menambahkan method untuk memperbarui remainingRequests
apiKeySchema.methods.updateRemainingRequests = function() {
  if (this.remainingRequests !== "∞") {
    this.remainingRequests -= 1;
  }
};

// Membuat model ApiKey berdasarkan schema yang sudah dibuat
const ApiKey = mongoose.model("ApiKey", apiKeySchema);

module.exports = ApiKey;
