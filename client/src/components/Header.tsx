import React, { useState } from 'react';

export default function Header() {
  return (
    <header className="w-full max-w-4xl flex items-center justify-between mb-6">
      <div className="flex items-center">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          <span className="text-white">Prompt</span> <span className="text-emerald-500">Me</span>
          <span className="text-xs ml-1 text-emerald-300 font-normal">v2</span>
        </h1>
      </div>
    </header>
  );
}
