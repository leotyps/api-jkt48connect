const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Mengimpor endpoint lainnya
const events = require("./events");
const theater = require("./theater");
const theaterDetail = require("./theater-detail");
const otherEndpoint = require("./other-endpoint");

// Middleware untuk parsing JSON
app.use(express.json());

// Menggunakan endpoint yang diimpor
app.use("/api/events", events);
app.use("/api/theater", theater);
app.use("/api/theater/", theaterDetail)
  ;app.use("/", otherEndpoint);

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
