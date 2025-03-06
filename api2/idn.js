const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/premium"); // Middleware validasi API key
const router = express.Router();

// Enable CORS
router.use(cors({
  origin: "*",
}));

async function fetchLiveStreams() {
  try {
    const response = await axios.post("https://api.idn.app/graphql", {
      query: `query SearchLivestream {
        searchLivestream(query: "", limit: 100) {
          result {
            slug
            title
            image_url
            view_count
            playback_url
            room_identifier
            status
            live_at
            end_at
            scheduled_at
            gift_icon_url
            category {
              name
              slug
            }
            creator {
              uuid
              username
              name
              avatar
              bio_description
              following_count
              follower_count
              is_follow
            }
          }
        }
      }`,
    });

    return response.data.data.searchLivestream.result;
  } catch (error) {
    console.error("Failed to fetch IDN Lives:", error.message);
    return [];
  }
}

function filterLiveStreams(streams) {
  return streams.filter(
    (stream) =>
      stream.creator.username.startsWith("jkt48_") ||
      (stream.creator.username.startsWith("jkt48-") &&
        stream.creator.name.endsWith("JKT48"))
  );
}

router.get("/", validateApiKey, async (req, res) => {
  try {
    const streams = await fetchLiveStreams();
    const filteredStreams = filterLiveStreams(streams);
    res.json(filteredStreams); // Mengirimkan data langsung tanpa teks tambahan
  } catch (error) {
    console.error("Error processing live data:", error.message);
    res.status(500).json({
      message: "Gagal mengambil data live.",
      error: error.message,
    });
  }
});

module.exports = router;
