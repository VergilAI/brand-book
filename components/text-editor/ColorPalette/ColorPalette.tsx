'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ColorPaletteProps {
  icon: React.ReactNode;
  onColorSelect: (color: string) => void;
  title: string;
}

const colors = [
  { name: 'Black', value: '#000000' },
  { name: 'Gray', value: '#6B7280' },
  { name: 'Red', value: '#DC2626' },
  { name: 'Orange', value: '#EA580C' },
  { name: 'Yellow', value: '#D97706' },
  { name: 'Green', value: '#16A34A' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Pink', value: '#DB2777' },
  { name: 'Cosmic Purple', value: '#6366F1' },
  { name: 'Electric Violet', value: '#A78BFA' },
  { name: 'Neural Pink', value: '#F472B6' },
];

export function ColorPalette({ icon, onColorSelect, title }: ColorPaletteProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          title={title}
          className="rounded-full h-9 w-9 hover:bg-cosmic-purple/10 dark:hover:bg-cosmic-purple/20 text-stone-gray dark:text-gray-400 hover:text-deep-space dark:hover:text-gray-200"
        >
          {icon}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 rounded-xl">
        <div className="grid grid-cols-4 gap-1">
          {colors.map((color) => (
            <button
              key={color.value}
              className={cn(
                "h-8 w-8 rounded-lg border border-mist-gray/50",
                "hover:scale-110 hover:border-cosmic-purple transition-all duration-200"
              )}
              style={{ backgroundColor: color.value }}
              onClick={() => onColorSelect(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}