const express = require("express");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Mengimpor endpoint lainnya
const events = require("./events");
const news = require("./news");
const theater = require("./theater");
const theaterDetail = require("./theater-detail");
const memberDetail = require("./member-detail");
const member = require("../api2/allMember");
const newsDetail = require("./news-detail");
const otherEndpoint = require("./other-endpoint");
const nowlive = require("./now-live");
const reLive = require("./recentLive");
const lastLive = require("../api2/jkt48-recent");
const checkApikey = require("./checkApikey");
const createPayment = require("./orkut-createPayment");
const orkutStatus = require("../api2/orkut-status");
const birthday = require("../api2/birthday");
const mongodb = require("../api2/mongodb");
const tiktok = require("../api2/tiktok");
const brat = require("../api2/brat");
const allapi = require("../api2/all-apikeys");
const zenova = require("../api2/zenova");
const youtube = require("../api2/youtube");
const idn = require("../api2/idn");
const showroom = require("../api2/showroom");
const pinterest = require("../api2/pinterest");

//Cors
app.use(cors({
  origin: '*', // Atau set domain spesifik, misalnya 'https://yourfrontenddomain.com'
}));

// Middleware untuk parsing JSON
app.use(express.json());

// Menggunakan endpoint yang diimpor
app.use("/api/events", events);
app.use("/api/news", news);
app.use("/api/news/", newsDetail);
app.use("/api/theater", theater);
app.use("/api/theater/", theaterDetail);
app.use("/api/member/", memberDetail);
app.use("/api/member", member);
app.use("/api/live", nowlive);
app.use("/api/live/idn", idn);
app.use("/api/live/showroom", showroom);
app.use("/api/recent/", reLive);
app.use("/api/recent", lastLive);
app.use("/api/", mongodb);
app.use("/", otherEndpoint);
app.use("/api", checkApikey);
app.use("/api", allapi);
app.use("/api", birthday);
app.use("/api/pin", pinterest);
app.use("/api/youtube", youtube);
app.use("/api/brat", brat);
app.use("/api/zenova", zenova);
app.use("/api/downloader/tiktok", tiktok);
app.use("/api/orkut/createpayment", createPayment);
app.use("/api/orkut/cekstatus", orkutStatus);

 
// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
