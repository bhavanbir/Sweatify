import React, { useState } from "react";
import Button from "./Button";
import { Music, Dumbbell, Activity, Layers } from "lucide-react";

export default function Hero({ onLogin, onGenerate, loading, loggedIn }) {
  // Local state for dropdown selections
  const [split, setSplit] = useState("full_body");
  const [level, setLevel] = useState("beginner");

  const handleGenerate = () => {
    // Pass the selected options back to App.jsx
    onGenerate(split, level);
  };

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-black px-6 text-center text-white">
      {/* Background Ambience */}
      <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-green-500/20 blur-[120px]" />
      <div className="absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative z-10 max-w-4xl space-y-8">
        <div>
          <h1 className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
            Train Smart. <br />
            <span className="text-white">Listen Better.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Select your workout style and difficulty. Sweatify builds a custom routine 
            and curates a playlist from your own music taste that matches the intensity.
          </p>
        </div>

        {/* CONTROLS SECTION */}
        {loggedIn && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-lg mx-auto bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
            
            {/* Split Selector */}
            <div className="text-left">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-green-400">
                <Layers size={16} /> Workout Split
              </label>
              <select 
                value={split} 
                onChange={(e) => setSplit(e.target.value)}
                className="w-full rounded-lg bg-black/50 border border-white/20 p-3 text-white focus:border-green-500 focus:outline-none"
              >
                <option value="full_body">Full Body (All Muscles)</option>
                <option value="upper">Upper Body</option>
                <option value="lower">Lower Body</option>
                <option value="push">Push (Chest/Shoulders/Tri)</option>
                <option value="pull">Pull (Back/Bicep)</option>
                <option value="legs">Legs Only</option>
              </select>
            </div>

            {/* Difficulty Selector */}
            <div className="text-left">
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-400">
                <Activity size={16} /> Difficulty
              </label>
              <select 
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
                className="w-full rounded-lg bg-black/50 border border-white/20 p-3 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="beginner">Beginner (Low Volume)</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced (High Volume)</option>
              </select>
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {!loggedIn ? (
            <Button onClick={onLogin} icon={Music} primary>
              Connect Spotify to Start
            </Button>
          ) : (
            <Button onClick={handleGenerate} icon={Dumbbell} primary>
              {loading ? "Building Routine..." : "Generate Workout & Playlist"}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
