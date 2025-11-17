// app/register/page.tsx
import Link from "next/link";

export default function Register() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo + Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-stone-800 tracking-tight">
            StorySphere
          </h1>
          <p className="text-stone-600 mt-3 text-lg">
            Join thousands of writers sharing their stories
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center">
            Create your account
          </h2>

          <form className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-stone-800 placeholder-stone-500 focus:outline-none focus:border-stone-500 focus:ring-4 focus:ring-stone-100 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-stone-800 placeholder-stone-500 focus:outline-none focus:border-stone-500 focus:ring-4 focus:ring-stone-100 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-stone-800 placeholder-stone-500 focus:outline-none focus:border-stone-500 focus:ring-4 focus:ring-stone-100 transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-xl text-stone-800 placeholder-stone-500 focus:outline-none focus:border-stone-500 focus:ring-4 focus:ring-stone-100 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-stone-700 hover:bg-stone-800 text-white font-semibold rounded-xl transition duration-200 shadow-md transform hover:scale-[1.02] active:scale-100"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-stone-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-stone-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-stone-700 font-semibold hover:underline underline-offset-4"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Bottom text */}
        <p className="text-center text-stone-500 text-xs mt-10">
          By signing up, you agree to our{" "}
          <a href="#" className="underline hover:text-stone-700">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-stone-700">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}