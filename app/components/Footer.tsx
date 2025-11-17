// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-stone-900 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h2 className="text-2xl font-bold tracking-wide text-white">
              StorySphere
            </h2>
            <p className="mt-3 text-stone-400 text-sm max-w-xs">
              A place for thoughtful writing and meaningful stories.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm md:text-base">
              Explore
            </h3>
            <ul className="space-y-3 text-stone-400 text-sm">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/stories" className="hover:text-white transition">
                  Stories
                </a>
              </li>
              <li>
                <a href="/categories" className="hover:text-white transition">
                  Categories
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm md:text-base">
              About
            </h3>
            <ul className="space-y-3 text-stone-400 text-sm">
              <li>
                <a href="/about" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm md:text-base">
              Legal
            </h3>
            <ul className="space-y-3 text-stone-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-stone-500 text-xs md:text-sm">
          © {new Date().getFullYear()} StorySphere. Made with love in Rwanda
        </div>
      </div>
    </footer>
  );
}