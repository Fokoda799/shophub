import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-2xl text-center">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="mb-4 text-[150px] font-black leading-none text-gray-900 md:text-[200px]">
            404
          </h1>
          <div className="mx-auto h-1 w-24 bg-gray-900" />
        </div>

        {/* Message */}
        <h2 className="mb-4 text-2xl font-black uppercase tracking-tight text-gray-900 md:text-3xl">
          Page Not Found
        </h2>
        <p className="mb-8 text-gray-600 md:text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-gray-800 md:px-8 md:py-4"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 bg-white px-6 py-3 text-sm font-bold uppercase tracking-wide text-gray-900 transition-colors hover:border-gray-900 hover:bg-gray-50 md:px-8 md:py-4"
          >
            <Search className="h-4 w-4" />
            Browse Shop
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500">
            Quick Links
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/new-arrivals"
              className="font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              New Arrivals
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/sale"
              className="font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              Sale
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/about"
              className="font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              About Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/contact"
              className="font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
