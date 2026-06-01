import React from 'react';

/** Lightweight placeholder while lazy route chunks load */
export default function RouteFallback() {
  return (
    <div
      className="min-h-[50vh] flex items-center justify-center bg-[#0A0A0A]"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-white/15 border-t-accent animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/40">Loading</p>
      </div>
    </div>
  );
}
