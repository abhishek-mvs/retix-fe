export const dynamic = "force-dynamic";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Simple Navigation Bar */}
        <nav className="py-4 border-b">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold">
              ReTix
            </Link>
          </div>
        </nav>

        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 