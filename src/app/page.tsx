'use client';
import QuickDraw from '@/components/QuickDraw';
import ReviewDrawings from '@/components/ReviewDrawings';
import { useTheme } from '@/pages/_app';
import { useState } from 'react';
import Login from '@/components/Login';

export default function Home() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={toggleDarkMode} className="absolute top-4 right-4 p-2 bg-gray-700 text-white rounded">
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <QuickDraw user={user} setUser={setUser} />
      {user && <ReviewDrawings user={user} />}
    </div>
  );
}
