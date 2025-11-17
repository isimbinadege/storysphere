"use client";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-stone-100 text-stone-700 border-b border-stone-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="StorySphere Logo" 
            width={40} 
            height={40} 
            className="rounded"
          />
          <span className="font-semibold text-xl tracking-wide">
            StorySphere
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a className="hover:text-stone-900 transition" href="/">Home</a>
          <a className="hover:text-stone-900 transition" href="/explore">Explore</a>
          <a className="hover:text-stone-900 transition" href="/tags">Tags</a>
          <a className="hover:text-stone-900 transition" href="/about">About</a>
          <button className="bg-stone-700 text-stone-100 px-4 py-2 rounded hover:bg-stone-800 transition">
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-stone-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden px-4 py-3 space-y-3 bg-stone-100 border-t border-stone-300">
          <a className="block hover:text-stone-900" href="/">Home</a>
          <a className="block hover:text-stone-900" href="/explore">Explore</a>
          <a className="block hover:text-stone-900" href="/tags">Tags</a>
          <a className="block hover:text-stone-900" href="/about">About</a>

          <button className="w-full bg-stone-700 text-stone-100 py-2 rounded hover:bg-stone-800 transition">
            Sign In
          </button>
        </div>
      )}
    </nav>
  );
}
