import { useState } from "react";
import Hero from "./components/Hero";
import Button from "./components/Button";
import WorkoutCard from "./components/WorkoutCard";

const BACKEND = "http://localhost:3000";

export default function App() {
  const [workout, setWorkout] = useState(null);
  const [playlistUrl, setPlaylistUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginSpotify = () => {
    window.location.href = `${BACKEND}/login`;
  };

  const generateAll = async () => {
    setLoading(true);

    const workoutRes = await fetch(
      `${BACKEND}/workout?muscle=chest&level=beginner`
    );
    const workoutData = await workoutRes.json();
    setWorkout(workoutData);

    const playlistRes = await fetch(`${BACKEND}/playlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalSeconds: workoutData.totalSeconds
      })
    });

    const playlistData = await playlistRes.json();
    setPlaylistUrl(playlistData.playlistUrl);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Hero onLogin={loginSpotify} />

      <div className="mt-16">
        <Button onClick={generateAll}>
          {loading ? "Generating..." : "Generate Workout + Playlist"}
        </Button>

        <WorkoutCard workout={workout} />

        {playlistUrl && (
          <a
            href={playlistUrl}
            target="_blank"
            className="block mt-6 text-primary underline"
          >
            Open Spotify Playlist
          </a>
        )}
      </div>
    </div>
  );
}
