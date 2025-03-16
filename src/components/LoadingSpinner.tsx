'use client';

export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center my-12">
      <div className="loader"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300 animate-pulse-slow">{message}</p>
    </div>
  );
} 