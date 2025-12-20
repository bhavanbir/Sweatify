import React from "react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-6">
        <a href="/" className="flex items-center gap-3 transition hover:opacity-80">
          <img src="/favicon.ico" alt="Home" className="h-8 w-8 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
          <span className="text-xl font-bold tracking-tight text-white">
            Sweat<span className="text-green-500">ify</span>
          </span>
        </a>
      </div>
    </nav>
  );
}