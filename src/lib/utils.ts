import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isTauriApp = () => typeof window !== "undefined" && typeof window.__TAURI_IPC__ !== "undefined";
