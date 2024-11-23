const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// URL MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://contact:pk9Gxy0yn6azNZJb@jkt48connect.whnvm.mongodb.net/?retryWrites=true&w=majority&appName=jkt48connect";

// Menghubungkan ke MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ Could not connect to MongoDB:", err.message);
    process.exit(1); // Keluar dari aplikasi jika tidak dapat terhubung ke MongoDB
  });

// Middleware untuk parsing JSON
app.use(express.json());

// Mengimpor endpoint lainnya
const events = require("./events");
const news = require("./news");
const theater = require("./theater");
const theaterDetail = require("./theater-detail");
const memberDetail = require("./member-detail");
const newsDetail = require("./news-detail");
const otherEndpoint = require("./other-endpoint");
const nowlive = require("./now-live");
const lastlive = require("./last-live");
const reLive = require("./recentLive");
const checkApikey = require("./checkApikey");

// Menggunakan endpoint yang diimpor
app.use("/api/events", events);
app.use("/api/news", news);
app.use("/api/news/", newsDetail);
app.use("/api/theater", theater);
app.use("/api/theater/", theaterDetail);
app.use("/api/member/", memberDetail);
app.use("/api/live", nowlive);
app.use("/api/live/last", lastlive);
app.use("/api/recent", reLive);
app.use("/", otherEndpoint);
app.use("/api", checkApikey);

// Menjalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
