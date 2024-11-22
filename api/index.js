const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

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
const theaterMember = require("./theater-member");

// Middleware untuk parsing JSON
app.use(express.json());

// Menggunakan endpoint yang diimpor
app.use("/api/events", events);
app.use("/api/news", news);
app.use("/api/news/", newsDetail);
app.use("/api/theater", theater);
app.use("/api/theater/", theaterDetail);
app.use("/api/theater/member/", theaterMember);
app.use("/api/member/", memberDetail);
app.use("/api/live", nowlive);
app.use("/api/live/last", lastlive);
app.use("/api/recent", reLive);
app.use("/", otherEndpoint);
app.use("/api", checkApikey);

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
