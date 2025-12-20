import React from "react";
import Button from "./Button";
import { Music, Dumbbell } from "lucide-react";

export default function Hero({ onLogin, onGenerate, loading, loggedIn }) {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-black px-6 text-center text-white">
      {/* Background Glows */}
      <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-green-500/20 blur-[120px]" />
      <div className="absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative z-10 max-w-4xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-green-400 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          AI-Powered Fitness & Music
        </div>

        <h1 className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          Your Workout, <br />
          <span className="text-white">Perfectly Tuned.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
          Stop wasting time searching for songs. Sweatify builds a custom
          workout and instantly generates a Spotify playlist that matches the duration and intensity.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {!loggedIn ? (
            <Button onClick={onLogin} icon={Music} primary>
              Connect Spotify
            </Button>
          ) : (
            <Button onClick={onGenerate} icon={Dumbbell} primary>
              {loading ? "Generating..." : "Generate Workout & Playlist"}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}