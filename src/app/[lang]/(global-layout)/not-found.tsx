import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        404
      </h1>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        There is nothing here. Go back the way you came.
      </p>
      <Link
        href="/"
        className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 font-medium transition-colors underline underline-offset-4"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
