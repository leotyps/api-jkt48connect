const express = require("express");
const axios = require("axios");
const cors = require("cors");
const validateApiKey = require("../middleware/auth"); // Middleware validasi API key

const router = express.Router();

// Enable CORS for all domains
router.use(cors({ origin: "*" }));

// API Key YouTube
const YOUTUBE_API_KEY = "AIzaSyBCHgsvXcZKl_qS3-vMGpT1FRRib_xhXpQ";

// ID channel YouTube JKT48
const CHANNEL_IDS = [
  "UCaIbbu5Xg3DpHsn_3Zw2m9w", // Channel utama JKT48
  "UCadv-UfEyjjwOPcZHc2QvIQ"  // Channel Academy / Subsidiary
];

// Fungsi untuk mengambil video terbaru dari sebuah channel
async function getLatestVideos(channelId) {
  try {
    // Ambil daftar video terbaru dari channel
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`, {
        params: {
          key: YOUTUBE_API_KEY,
          channelId: channelId,
          part: "snippet",
          order: "date",
          maxResults: 5
        }
      }
    );

    const videos = response.data.items.map(video => ({
      videoId: video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.high.url,
      videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      publishedAt: video.snippet.publishedAt,
      channelId: video.snippet.channelId
    }));

    // Ambil detail video (views)
    const videoIds = videos.map(v => v.videoId).join(",");
    const videoDetails = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          key: YOUTUBE_API_KEY,
          id: videoIds,
          part: "statistics"
        }
      }
    );

    // Ambil detail channel (nama & foto profil)
    const channelDetails = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels`, {
        params: {
          key: YOUTUBE_API_KEY,
          id: channelId,
          part: "snippet"
        }
      }
    );

    const channelInfo = channelDetails.data.items[0].snippet;
    const channelName = channelInfo.title;
    const channelImage = channelInfo.thumbnails.high.url;

    // Gabungkan data video dengan views dan channel info
    return videos.map((video, index) => ({
      ...video,
      views: videoDetails.data.items[index]?.statistics?.viewCount || "0",
      channelName,
      channelImage
    }));
  } catch (error) {
    console.error(`Error fetching videos for channel ${channelId}:`, error.message);
    return [];
  }
}

// Endpoint untuk mendapatkan video terbaru dari 2 channel JKT48
router.get("/", validateApiKey, async (req, res) => {
  try {
    const videoPromises = CHANNEL_IDS.map(id => getLatestVideos(id));
    const results = await Promise.all(videoPromises);

    // Gabungkan semua video dari kedua channel dalam satu array
    const allVideos = results.flat();

    res.json(allVideos);
  } catch (error) {
    console.error("Error fetching videos:", error.message);
    res.status(500).json([]);
  }
});

module.exports = router;
