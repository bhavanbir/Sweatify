import React from "react";

export default function Button({ children, onClick, primary, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 font-bold transition-all duration-300
        ${
          primary
            ? "bg-green-500 text-black hover:scale-105 hover:bg-green-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
            : "border border-white/20 bg-white/5 text-white hover:border-white/50 hover:bg-white/10"
        }
      `}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span>{children}</span>
    </button>
  );
}