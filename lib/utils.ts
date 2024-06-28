import { Level } from "@/utils/types";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalize(str: string) {
  return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export function getLevelById(levels: Level[], key: string): Level | undefined {
  const level = levels.find(level => level.levelid === key);
  return level ? level : undefined;
}

export function getNextLevel(levels: Level[], key: string): Level | undefined {
  const currentIndex = levels.findIndex(level => level.levelid === key);
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return undefined; // No next level available
  }
  return levels[currentIndex + 1];
}