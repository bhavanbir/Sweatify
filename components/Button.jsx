export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        bg-primary
        px-6 py-3
        rounded-xl
        font-semibold
        shadow-lg
        hover:scale-105
        transition-transform
      "
    >
      {children}
    </button>
  );
}
