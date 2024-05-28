import axios from "axios";

export default async function handler(req, res) {
    const { youtubeUrl } = req.body;
    console.log('youtubeUrl:',youtubeUrl);

    let videoId;
    const url = new URL(youtubeUrl);

    if (url.hostname === 'www.youtube.com' || url.hostname === 'youtube.com') {
        videoId = url.searchParams.get('v');
      } else if (url.hostname === 'youtu.be') {
        videoId = url.pathname.slice(1);
      }
    if (!videoId) {
        res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const API_KEY = process.env.YOUTUBE_API_KEY;
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`;

    try {
        const response = await axios.get(apiUrl);
        const videoData = response.data.items[0];
        
        if (!videoData) {
            return res.status(404).json({ error: "Video not found" });
        }

        const { title, description, thumbnails, channelTitle, publishedAt } = videoData.snippet;
        const { duration, dimension, definition } = videoData.contentDetails;
        const durationMinutes = parseInt(duration.slice(2, duration.length - 1));
        const videoId = videoData.id;
        const thumbnailUrl = thumbnails.high.url;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        res.status(200).json({ title, description, thumbnailUrl, videoUrl, duration, durationMinutes, videoId, channelTitle, publishedAt, dimension, definition, thumbnails });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch video data" });
    }

}