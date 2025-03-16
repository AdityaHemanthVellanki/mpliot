import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  weight: ['600'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export default function Navigation() {
  return (
    <nav className="bg-white/80 dark:bg-primary-dark/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className={`${poppins.variable} font-heading text-xl font-bold bg-gradient-to-r from-accent-blue to-accent-pink bg-clip-text text-transparent`}>
                  MPilot
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/" 
                className="border-transparent text-gray-600 dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue border-b-2 hover:border-accent-blue inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
              >
                Home
              </Link>
              <Link 
                href="/models" 
                className="border-transparent text-gray-600 dark:text-gray-300 hover:text-accent-blue dark:hover:text-accent-blue border-b-2 hover:border-accent-blue inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
              >
                Models
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
} 