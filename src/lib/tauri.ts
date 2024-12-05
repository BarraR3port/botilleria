"use client";
//@ts-ignore
export const isTauriApp = () => typeof window !== "undefined" && typeof window.__TAURI_INTERNALS__ !== "undefined";
