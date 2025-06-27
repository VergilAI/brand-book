import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('hu-HU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(num);
}

export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function formatCompactNumber(num: number): string {
  const absNum = Math.abs(num);
  if (absNum >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (absNum >= 1000) {
    return `${(num / 1000).toFixed(0)}k`;
  }
  return num.toFixed(0);
}
