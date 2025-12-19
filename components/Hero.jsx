import Button from "./Button";

export default function Hero({ onLogin }) {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-6xl font-bold text-primary mb-6">
          Workoutify
        </h1>

        <p className="text-lg text-gray-300 mb-8">
          Connect Spotify. Generate workouts.
          Get playlists perfectly synced to your training.
        </p>

        <Button onClick={onLogin}>
          Connect Spotify
        </Button>
      </div>

      <div className="bg-white/5 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">
          How it works
        </h2>
        <ul className="space-y-3 text-gray-300">
          <li>• Choose muscle group & level</li>
          <li>• Workout generated via MuscleWiki</li>
          <li>• Playlist duration matches workout</li>
        </ul>
      </div>
    </div>
  );
}
