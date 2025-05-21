import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full max-w-4xl mt-4 text-center text-xs text-neutral-500">
      <p>
        <span className="mr-2">© 2025 Prompt Me</span>
        <a href="#" className="text-emerald-500 hover:underline hover:text-emerald-400 mx-1">About</a>
        <a href="#" className="text-emerald-500 hover:underline hover:text-emerald-400 mx-1">Privacy</a>
      </p>
    </footer>
  );
}
