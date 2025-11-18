"use client"; 

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; 
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';


export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
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
        <div className="hidden md:flex items-center gap-4">
  {user ? (
    <>
      <Link href="/profile" className="text-stone-700 hover:text-stone-900 font-medium">
        Profile
      </Link>
      <button
        onClick={() => supabase.auth.signOut()}
        className="px-5 py-2 bg-stone-700 text-white rounded-xl hover:bg-stone-800 transition"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link href="/login" className="text-stone-700 hover:text-stone-900 font-medium">
        Login
      </Link>
      <Link
        href="/register"
        className="px-5 py-2 bg-stone-700 text-white rounded-xl hover:bg-stone-800 transition"
      >
        Sign Up
      </Link>
    </>
  )}
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

         {user ? (
  <>
    <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-300">
      Profile
    </Link>
    <button
      onClick={() => {
        supabase.auth.signOut();
        setMobileMenuOpen(false);
      }}
      className="w-full text-left py-2 text-stone-700"
    >
      Logout
    </button>
  </>
) : (
  <>
    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-700">
      Login
    </Link>
    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-stone-300">
      Sign Up
    </Link>
  </>
)}
        </div>
      </div>
    </nav>
  );
}