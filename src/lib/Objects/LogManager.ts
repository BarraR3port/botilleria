import { isTauriApp } from "../Language/redirect";

export async function debug(message: string, ...objects: any[]): Promise<void> {
	//const appStore = useAppStore();
	//if (!appStore.debug) return;
	if (false) {
		const { attachConsole, debug } = await import("tauri-plugin-log-api");
		const detach = await attachConsole();
		const finalMessage =
			message +
			(objects[0] === undefined || objects[0].length !== 0
				? objects.map(object => JSON.stringify(object, null, 4)).join(" ")
				: "");
		await debug(finalMessage);
		detach();
	} else {
		console.debug(message, ...objects);
	}
}

export async function info(message: string, ...objects: any[]): Promise<void> {
	if (false) {
		const { attachConsole, info } = await import("tauri-plugin-log-api");
		const detach = await attachConsole();
		const finalMessage =
			message +
			(objects[0] === undefined || objects[0].length !== 0
				? objects.map(object => JSON.stringify(object, null, 4)).join(" ")
				: "");
		await info(finalMessage);
		detach();
	} else {
		console.info(message, ...objects);
	}
}

export async function warn(message: string, ...objects: any[]): Promise<void> {
	if (false) {
		const { attachConsole, warn } = await import("tauri-plugin-log-api");
		const detach = await attachConsole();
		const finalMessage =
			message +
			(objects[0] === undefined || objects[0].length !== 0
				? objects.map(object => JSON.stringify(object, null, 4)).join(" ")
				: "");
		await warn(finalMessage);
		detach();
	} else {
		console.warn(message, ...objects);
	}
}

export async function error(message: string, ...objects: any[]): Promise<void> {
	if (false) {
		const { attachConsole, error } = await import("tauri-plugin-log-api");
		const detach = await attachConsole();
		const finalMessage =
			message +
			(objects[0] === undefined || objects[0].length !== 0
				? objects.map(object => JSON.stringify(object, null, 4)).join(" ")
				: "");
		await error(finalMessage);
		detach();
	} else {
		console.error(message, ...objects);
	}
}

export interface TimeDuration {
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}

export function getTime(init: number, end: number): TimeDuration {
	const duration = end - init;
	const hours = Math.floor(duration / 3600000);
	const minutes = Math.floor((duration % 3600000) / 60000);
	const seconds = Math.floor((duration % 60000) / 1000);
	const milliseconds = Math.floor(duration % 1000);
	return { hours, minutes, seconds, milliseconds };
}
