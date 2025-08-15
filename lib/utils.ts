import { v4 as uuidv4 } from "uuid";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API key generator
export function generateApiKey(): string {
  return `fk_${uuidv4().replace(/-/g, "")}`;
}
