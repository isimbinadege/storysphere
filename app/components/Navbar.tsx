"use client"; 

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; 

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-stone-800 text-white shadow-lg fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-semibold tracking-wide">
            StorySphere
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-base">
          <Link href="/" className="hover:text-stone-300 transition-all">
            Home
          </Link>
          <Link href="/stories" className="hover:text-stone-300 transition-all">
            Stories
          </Link>
          <Link href="/categories" className="hover:text-stone-300 transition-all">
            Categories
          </Link>
          <Link href="/about" className="hover:text-stone-300 transition-all">
            About
          </Link>
          <Link href="/contact" className="hover:text-stone-300 transition-all">
            Contact
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg border border-stone-600 hover:bg-stone-700 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 rounded-lg bg-stone-600 hover:bg-stone-500 transition font-medium"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden z-50"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu - slides down */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-stone-800 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col px-6 py-4 space-y-4">
          <Link
            href="/"
            className="hover:text-stone-300 transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/stories"
            className="hover:text-stone-300 transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            Stories
          </Link>
          <Link
            href="/categories"
            className="hover:text-stone-300 transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="hover:text-stone-300 transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-stone-300 transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>

          <div className="flex flex-col gap-3 pt-4 border-t border-stone-700">
            <Link
              href="/login"
              className="px-4 py-2 text-center rounded-lg border border-stone-600 hover:bg-stone-700 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-center rounded-lg bg-stone-600 hover:bg-stone-500 transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}