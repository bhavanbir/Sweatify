export default function WorkoutCard({ workout }) {
  if (!workout) return null;

  return (
    <div className="bg-white/5 rounded-2xl p-6 mt-10">
      <h3 className="text-xl font-semibold mb-4">
        Your Workout
      </h3>

      <ul className="space-y-2">
        {workout.exercises.map((e, i) => (
          <li
            key={i}
            className="flex justify-between border-b border-white/10 pb-2"
          >
            <span>{e.name}</span>
            <span className="text-primary">
              {Math.round(e.duration / 60)} min
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-sm text-gray-400">
        Total time: {Math.round(workout.totalSeconds / 60)} minutes
      </p>
    </div>
  );
}
