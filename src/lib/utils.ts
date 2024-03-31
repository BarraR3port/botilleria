import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
//@ts-ignore
export const isTauriApp = () => !!window.__TAURI_INTERNAL__;
