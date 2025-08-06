'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { Button } from '@/components/ui/button';
import { 
  HomeIcon, 
  UserPlusIcon 
} from '@heroicons/react/24/outline';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ST</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Therapy
            </span>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-3">
            <Button asChild variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
              <Link href={'/masuk' as Route}>
                <HomeIcon className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Link href={'/daftar' as Route}>
                <UserPlusIcon className="w-4 h-4 mr-2" />
                Daftar
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 