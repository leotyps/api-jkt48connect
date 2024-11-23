const mongoose = require("mongoose");

const liveDataSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  img: { type: String, required: true },
  img_alt: { type: String, required: true },
  last_live: {
    id: { type: String },
    date: {
      start: { type: Date },
      end: { type: Date },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LiveData", liveDataSchema);
