import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full max-w-4xl mt-4 text-center text-xs text-neutral-500">
      <p>
        Built with GPT-4o · 
        <a href="#" className="text-emerald-500 hover:underline ml-1">About</a> · 
        <a href="#" className="text-emerald-500 hover:underline ml-1">Privacy</a>
      </p>
    </footer>
  );
}
