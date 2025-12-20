import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WorkoutCard from "./components/WorkoutCard";

// Ensure this matches your backend port
const BACKEND = "http://localhost:3000";

export default function App() {
  const [workout, setWorkout] = useState(null);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if user is logged in (url params or local check)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") || localStorage.getItem("spotify_token")) {
      setLoggedIn(true);
      if (params.get("success")) window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const loginSpotify = () => {
    window.location.href = `${BACKEND}/login`;
  };

  const generateAll = async () => {
    setLoading(true);
    try {
      // 1. Generate Workout
      const workoutRes = await fetch(`${BACKEND}/workout?muscle=chest`);
      const workoutData = await workoutRes.json();
      setWorkout(workoutData);

      // 2. Generate Playlist
      const playlistRes = await fetch(`${BACKEND}/playlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalSeconds: workoutData.totalSeconds }),
      });
      
      const playlistData = await playlistRes.json();
      setPlaylistUrl(playlistData.playlistUrl);
    } catch (error) {
      console.error("Error generating:", error);
      alert("Something went wrong! Make sure the backend is running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500/30">
      <Navbar />
      <div className="pt-16"> {/* Spacer for fixed navbar */}
        <Hero 
          onLogin={loginSpotify} 
          onGenerate={generateAll} 
          loading={loading}
          loggedIn={loggedIn}
        />

        {/* Results Section */}
        {(workout || playlistUrl) && (
            <section className="mx-auto max-w-5xl px-6 py-16 animate-fade-in">
              <div className="grid gap-12 md:grid-cols-2">
                <WorkoutCard workout={workout} />
                
                {playlistUrl && (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                    <h2 className="mb-6 text-2xl font-bold text-green-400">Your Playlist</h2>
                    <p className="mb-6 text-gray-400">
                      Generated to match your {Math.round(workout?.totalSeconds / 60)} minute workout.
                    </p>
                    <a
                      href={playlistUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-xl bg-[#1DB954] py-4 font-bold text-black transition hover:bg-[#1ed760]"
                    >
                      Open in Spotify
                    </a>
                  </div>
                )}
              </div>
            </section>
        )}
      </div>
    </div>
  );
}