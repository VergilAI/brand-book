'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-mist-gray/20 dark:bg-gray-800/50 rounded-lg">
      <Sun className={cn(
        "h-4 w-4 transition-colors",
        theme === 'light' ? 'text-cosmic-purple' : 'text-stone-gray'
      )} />
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="relative h-6 w-11 rounded-full p-0 bg-stone-gray/20 dark:bg-gray-700"
      >
        <span 
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-pure-light dark:bg-gray-200 shadow-sm transition-transform duration-200",
            theme === 'dark' && 'translate-x-5'
          )}
        />
      </Button>
      <Moon className={cn(
        "h-4 w-4 transition-colors",
        theme === 'dark' ? 'text-cosmic-purple' : 'text-stone-gray'
      )} />
    </div>
  );
}