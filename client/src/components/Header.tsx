import React, { useState } from 'react';

export default function Header() {
  const [darkMode, setDarkMode] = useState(true);
  
  // Theme toggle is included but since we're keeping the app dark-themed per requirements
  // we're not actually implementing the light mode styles
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="w-full max-w-4xl flex items-center justify-between mb-6">
      <div className="flex items-center">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Prompt <span className="text-emerald-500">Me</span>
          <span className="text-xs ml-1 text-neutral-400 font-normal">v2</span>
        </h1>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={toggleTheme}
          className="text-neutral-400 hover:text-white p-2 rounded-full"
          aria-label="Toggle theme"
        >
          <i className="fas fa-moon"></i>
        </button>
        <button 
          className="text-neutral-400 hover:text-white p-2 rounded-full"
          aria-label="Settings"
        >
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </header>
  );
}
