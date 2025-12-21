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

// --- HELPER CONFIGURATION ---
const WORKOUT_SPLITS = {
  full_body: ["chest", "lats", "quads", "hamstrings", "shoulders"],
  upper: ["chest", "lats", "shoulders", "biceps", "triceps"],
  lower: ["quads", "hamstrings", "glutes", "calves"],
  push: ["chest", "shoulders", "triceps"],
  pull: ["lats", "biceps", "traps"],
  legs: ["quads", "hamstrings", "glutes"],
  chest_focus: ["chest"],
  back_focus: ["lats"],
};

const DIFFICULTY_SCALING = {
  beginner: { sets: 3, reps: "10-12", exercisesPerGroup: 1 },
  intermediate: { sets: 4, reps: "10-12", exercisesPerGroup: 2 }, // Higher volume
  advanced: { sets: 5, reps: "8-10", exercisesPerGroup: 2 }, // High volume + intensity
};

// --- ROUTES ---

app.get("/login", (req, res) => {
  // Added 'user-top-read' to access user's music taste
  const scopes = [
    "playlist-modify-public",
    "playlist-modify-private",
    "user-top-read" 
  ];
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

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

    res.redirect("http://localhost:5173/?success=true");
  } catch (err) {
    console.error("Error getting Tokens:", err);
    res.send(`Error getting Tokens: ${err}`);
  }
});

// 1. SMART WORKOUT GENERATOR
app.get("/workout", async (req, res) => {
  const { split, level } = req.query; // e.g., split="push", level="intermediate"
  
  const selectedSplit = WORKOUT_SPLITS[split] || WORKOUT_SPLITS.full_body;
  const settings = DIFFICULTY_SCALING[level] || DIFFICULTY_SCALING.beginner;

  try {
    // We make parallel requests for every muscle group in the split
    const exercisePromises = selectedSplit.map(async (muscle) => {
      const options = {
        method: 'GET',
        url: `https://musclewiki.p.rapidapi.com/exercises`,
        params: { category: muscle },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'musclewiki.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        // Randomly shuffle the results so it's not the same workout every time
        const shuffled = response.data.sort(() => 0.5 - Math.random());
        // Pick specific number of exercises based on difficulty
        const selected = shuffled.slice(0, settings.exercisesPerGroup);

        // Format them
        return selected.map(ex => ({
          name: ex.exercise_name || ex.name,
          muscle: muscle,
          sets: settings.sets,
          reps: settings.reps
        }));
      } catch (err) {
        console.error(`Failed to fetch ${muscle}`, err);
        return [];
      }
    });

    // Wait for all API calls to finish
    const results = await Promise.all(exercisePromises);
    const flatExercises = results.flat();

    // Calculate total duration (approx 3 mins per set including rest)
    const totalSets = flatExercises.reduce((acc, curr) => acc + curr.sets, 0);
    const totalSeconds = totalSets * 3 * 60; 

    res.json({
      split: split,
      level: level,
      exercises: flatExercises,
      totalSeconds: totalSeconds
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch workout" });
  }
});

// 2. PERSONALIZED SPOTIFY GENERATOR
app.post("/playlist", async (req, res) => {
  const { totalSeconds } = req.body;

  try {
    // A. Get User's Top Tracks (Seed Mechanism)
    // We use this to know what genre/style they actually like
    const topTracksRes = await spotifyApi.getMyTopTracks({ limit: 5 });
    const seedTracks = topTracksRes.body.items.map(track => track.id);

    // B. Get Recommendations based on those seeds + High Energy parameters
    const recommendationRes = await spotifyApi.getRecommendations({
      seed_tracks: seedTracks.slice(0, 5), // Max 5 seeds allowed
      min_energy: 0.7,    // High energy
      min_tempo: 120,     // Fast pace
      limit: 50           // Get a big pool to choose from
    });

    const potentialTracks = recommendationRes.body.tracks;
    
    // C. Create Playlist
    const me = await spotifyApi.getMe();
    const playlist = await spotifyApi.createPlaylist(`Sweatify ${new Date().toLocaleDateString()}`, {
      description: `A high-energy mix based on your music taste, timed for a ${Math.round(totalSeconds/60)} min workout.`,
      public: false,
    });

    // D. Fit Duration
    let currentDuration = 0;
    const selectedUris = [];

    for (let track of potentialTracks) {
      if (currentDuration < totalSeconds * 1000) {
        selectedUris.push(track.uri);
        currentDuration += track.duration_ms;
      }
    }

    // E. Add to Playlist
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
