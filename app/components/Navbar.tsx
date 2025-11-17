import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-stone-800 text-white shadow-lg fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
        
          <Link href="/" className="text-xl font-semibold tracking-wide">StorySphere</Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-base">
          <Link href="/" className="hover:text-stone-300 transition-all">Home</Link>
          <Link href="/stories" className="hover:text-stone-300 transition-all">Stories</Link>
          <Link href="/categories" className="hover:text-stone-300 transition-all">Categories</Link>
          <Link href="/about" className="hover:text-stone-300 transition-all">About</Link>
          <Link href="/contact" className="hover:text-stone-300 transition-all">Contact</Link>
        </div>

        {/* Auth Buttons */}
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
      </div>
    </nav>
  );
}
