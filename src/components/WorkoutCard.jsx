export default function WorkoutCard({ workout }) {
  if (!workout) return null;

  return (
    <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Your Workout</h2>

      <ul className="space-y-3">
        {workout.exercises.map((ex, i) => (
          <li
            key={i}
            className="flex justify-between border-b border-white/10 pb-2"
          >
            <span>{ex.name}</span>
            <span className="text-gray-400">
              {ex.sets}×{ex.reps}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-sm text-gray-400">
        Total Time: {Math.round(workout.totalSeconds / 60)} minutes
      </div>
    </div>
  );
}
