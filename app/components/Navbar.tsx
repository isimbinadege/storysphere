 
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="w-full bg-stone-900 text-white shadow-lg fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          StorySphere
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="hover:text-stone-300 transition">
            Home
          </Link>
          <Link href="/stories" className="hover:text-stone-300 transition">
            Stories
          </Link>
          <Link href="/about" className="hover:text-stone-300 transition">
            About
          </Link>
        </div>

        {/* SEARCH BAR — DESKTOP */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users or stories..."
              className="w-full px-6 py-3 pl-12 rounded-full bg-stone-800 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            <button
              type="submit"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition"
            >
              <Search size={22} />
            </button>
          </form>
        </div>

        {/* Desktop Auth + Write Button */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/write"
                className="px-6 py-2.5 bg-stone-700 hover:bg-stone-600 text-white font-medium rounded-full transition shadow-md"
              >
                Write
              </Link>
              
              {/* FIXED: Real profile with user ID */}
              <Link 
                href={`/profile/${user.id}`} 
                className="hover:text-stone-300 transition font-medium"
              >
                Profile
              </Link>

              <button
                onClick={() => supabase.auth.signOut()}
                className="px-5 py-2.5 bg-stone-700 hover:bg-stone-600 rounded-full transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-stone-300 transition font-medium">
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-800 border-t border-stone-700">
          <div className="px-6 py-6 space-y-6">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users or stories..."
                className="w-full px-6 py-4 pl-14 rounded-full bg-stone-700 text-white placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="absolute left-5 top-1/2 -translate-y-1/2"
              >
                <Search size={24} />
              </button>
            </form>

            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block text-lg hover:text-stone-300">
              Home
            </Link>
            <Link href="/stories" onClick={() => setMobileMenuOpen(false)} className="block text-lg hover:text-stone-300">
              Stories
            </Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block text-lg hover:text-stone-300">
              About
            </Link>
   
            <div className="border-t border-stone-700 pt-6 mt-4 space-y-4">
              {user ? (
                <>
                  <Link 
                    href="/write" 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="block w-full text-center py-4 bg-emerald-600 hover:bg-emerald-700 rounded-full text-white font-bold text-lg"
                  >
                    Write a Story
                  </Link>
                  
                  <Link 
                    href={`/profile/${user.id}`} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="block py-3 text-center text-white font-medium"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={() => {
                      supabase.auth.signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-4 bg-stone-700 hover:bg-stone-600 rounded-full text-white font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-center text-white font-medium">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center py-4 bg-emerald-600 hover:bg-emerald-700 rounded-full text-white font-bold text-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}