const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/premium"); // Middleware validasi API key
const router = express.Router();

// Enable CORS
router.use(cors({ origin: "*" }));

// Fungsi untuk mengambil data live Showroom
async function fetchLiveStreams() {
  try {
    const response = await axios.get("https://www.showroom-live.com/api/live/onlives");
    const allLives = response.data.onlives.flatMap((genre) => genre.lives);
    return allLives;
  } catch (error) {
    console.error("❗ Failed to fetch Showroom");
    return null;
  }
}

// Filter hanya live streaming dari JKT48
function filterLiveStreams(streams) {
  return streams.filter(
    (stream) =>
      stream.room_url_key?.startsWith("JKT48_") ||
      (stream.room_url_key?.startsWith("officialJKT48") && stream.main_name?.includes("JKT48"))
  );
}

// Format tanggal dan waktu
function parseDateTime(localeString) {
  const date = new Date(localeString);
  const options = { hour: "2-digit", minute: "2-digit", hour12: false };
  const time = date.toLocaleTimeString("en-GB", options);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${time}/${day}/${month}/${year}`;
}

// Nama pengganti untuk beberapa member
const nameReplacements = [
  { original: "Fiony", replacement: "Cepio" },
  { original: "Adel", replacement: "Dedel" },
  { original: "Gita", replacement: "Gita 🥶" },
  { original: "Gracia", replacement: "Ci Gre" },
  { original: "Lia", replacement: "Ci Lia" },
  { original: "Olla", replacement: "Olali" },
  { original: "Oniel", replacement: "Onyil" },
  { original: "Jessi", replacement: "Jeci" },
  { original: "Helisma", replacement: "Ceu Eli" },
  { original: "Indah", replacement: "Kak Indah" },
  { original: "Kathrina", replacement: "Atin" },
  { original: "Greesel", replacement: "Icel" },
  { original: "Cynthia", replacement: "Ciput" },
  { original: "Erine", replacement: "Erni" },
  { original: "Delynn", replacement: "Deyinn" },
  { original: "Feni", replacement: "Teh Mpen" },
  { original: "Freya", replacement: "Fureya" },
  { original: "Cathy", replacement: "Keti" },
  { original: "Oline", replacement: "Oyin" },
  { original: "Aralie", replacement: "Ayayi" },
  { original: "Christy", replacement: "Kiti" },
  { original: "Callie", replacement: "Keli" },
  { original: "Flora", replacement: "Mplorr" },
  { original: "Gracie", replacement: "Ecarg" },
  { original: "Muthe", replacement: "Mumuchang" },
  { original: "Nayla", replacement: "Nayra" },
  { original: "Regie", replacement: "Reji" },
  { original: "JKT48 Official SHOWROOM", replacement: "Om JOT" },
];

function replaceName(name) {
  for (const { original, replacement } of nameReplacements) {
    if (name.includes(original)) {
      return name.replace(original, replacement);
    }
  }
  return name;
}

// Endpoint untuk mengambil data live saat ini
router.get("/", validateApiKey, async (req, res) => {
  const streams = await fetchLiveStreams();
  if (!streams) {
    return res.status(500).json({ message: "Gagal mengambil data live Showroom." });
  }

  const seenIds = new Set(); // Variabel lokal untuk menyaring ID hanya selama request ini

  const liveStreams = filterLiveStreams(streams)
    .filter((stream) => {
      if (seenIds.has(stream.live_id)) return false; // Jika ID sudah ada, skip
      seenIds.add(stream.live_id); // Tambahkan ID ke set hanya selama request ini
      return true;
    })
    .map((stream) => {
      const displayName = stream.main_name.split(/\/|（/)[0].trim();
      const replacedName = replaceName(displayName);

      return {
        id: stream.live_id,
        name: replacedName,
        original_name: displayName,
        followers: stream.follower_num,
        start_live: parseDateTime(new Date().toISOString()),
        image: stream.image,
        image_square: stream.image_square,
        showroom_url: `https://www.showroom-live.com/r/${stream.room_url_key}`,
        watch_fullscreen: `https://dc.crstlnz.my.id/watch/${stream.room_url_key}`,
        multi_stream: `https://dc.crstlnz.my.id/multi`,
      };
    });

  res.json(liveStreams);
});

module.exports = router;
