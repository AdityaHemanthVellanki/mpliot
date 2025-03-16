import Link from 'next/link';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4">
      <div className="glass p-8 rounded-card text-center max-w-md animate-fade-in">
        <h1 className="font-heading text-4xl font-bold mb-4 text-text-dark dark:text-text-white">
          404
        </h1>
        <div className="h-1 w-16 bg-accent-blue mx-auto mb-6"></div>
        <h2 className="font-heading text-2xl font-semibold mb-4 text-text-dark dark:text-text-white">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link href="/" className="btn flex items-center justify-center gap-2 mx-auto w-full max-w-xs">
          <FiHome /> Return to Home
        </Link>
      </div>
    </div>
  );
} 