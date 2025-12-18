'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        We encountered an unexpected error. This might be a temporary issue.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 text-gray-900 hover:text-gray-600 font-medium transition-colors underline underline-offset-4"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-4 py-2 text-gray-900 hover:text-gray-600 font-medium transition-colors underline underline-offset-4"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
