import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

// --- ROUTES ---

// 1. Spotify Login
app.get("/login", (req, res) => {
  const scopes = ["playlist-modify-public", "playlist-modify-private"];
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

// 2. Callback
app.get("/callback", async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;

  if (error) return res.send(`Callback Error: ${error}`);

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body["access_token"];
    const refreshToken = data.body["refresh_token"];

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);

    // Redirect back to frontend
    res.redirect("http://localhost:5173/?success=true");
  } catch (err) {
    console.error("Error getting Tokens:", err);
    res.send(`Error getting Tokens: ${err}`);
  }
});

// 3. Generate Workout (MuscleWiki API)
app.get("/workout", async (req, res) => {
  const { muscle } = req.query; // e.g., "chest"
  
  try {
    // Determine target muscle ID (Simplified mapping for MuscleWiki)
    // In a real app, you might map more muscles or use the API's muscle list
    const musclePath = muscle || "chest";

    const options = {
      method: 'GET',
      url: `https://musclewiki.p.rapidapi.com/exercises`,
      params: {category: musclePath}, 
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'musclewiki.p.rapidapi.com'
      }
    };

    // Note: If you don't have a RapidAPI key yet, uncomment the mock data below and comment out the axios call
    const response = await axios.request(options);
    const exercises = response.data.slice(0, 5); // Take top 5 exercises

    /* // MOCK DATA (Use this if API fails)
    const exercises = [
        { name: "Bench Press", target: "Chest" },
        { name: "Push Ups", target: "Chest" },
        { name: "Dumbbell Flys", target: "Chest" },
    ];
    */

    // Calculate arbitrary duration: 3 sets * 45s per set + 60s rest = ~3 mins per exercise
    const durationPerExercise = 180; // seconds
    const totalSeconds = exercises.length * durationPerExercise;

    const formattedWorkout = {
      exercises: exercises.map(ex => ({
        name: ex.exercise_name || ex.name, // Adjust based on exact API response
        sets: 3,
        reps: 10
      })),
      totalSeconds: totalSeconds
    };

    res.json(formattedWorkout);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch workout" });
  }
});

// 4. Generate Playlist
app.post("/playlist", async (req, res) => {
  const { totalSeconds } = req.body;

  try {
    // 1. Create a Playlist
    const me = await spotifyApi.getMe();
    const playlist = await spotifyApi.createPlaylist(`Sweatify Workout`, {
      description: `Generated workout playlist for ${Math.round(totalSeconds/60)} minutes.`,
      public: false,
    });

    // 2. Find tracks (High Energy / Workout)
    const trackSearch = await spotifyApi.searchTracks('workout gym high energy', { limit: 20 });
    const tracks = trackSearch.body.tracks.items;

    // 3. Select tracks to fit duration
    let currentDuration = 0;
    const selectedUris = [];

    for (let track of tracks) {
      if (currentDuration < totalSeconds * 1000) { // Spotify uses milliseconds
        selectedUris.push(track.uri);
        currentDuration += track.duration_ms;
      }
    }

    // 4. Add to playlist
    if (selectedUris.length > 0) {
      await spotifyApi.addTracksToPlaylist(playlist.body.id, selectedUris);
    }

    res.json({ playlistUrl: playlist.body.external_urls.spotify });

  } catch (error) {
    console.error("Playlist Error:", error);
    res.status(500).json({ error: "Failed to generate playlist" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});