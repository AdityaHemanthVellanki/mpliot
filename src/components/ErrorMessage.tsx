'use client';

import { FiAlertCircle } from 'react-icons/fi';

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="error-container">
      <FiAlertCircle className="text-red-500 text-xl flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
} 