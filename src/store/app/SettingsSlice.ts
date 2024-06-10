import { isTauriApp } from "@/lib/tauri";
import { debounce } from "lodash";
import type { StateCreator } from "zustand";
import type { ProductSlice } from "./ProductSlice";
import type { SessionSlice } from "./SessionSlice";

export interface SettingsSlice {
	debug: boolean;
	loaded: boolean;
	loadedSettings: boolean;
	loadSettings: () => Promise<void>;
	saveSettings: (delay?: number) => Promise<boolean>;
	changeDebug: (value: boolean) => Promise<void>;
}

export const createSettingsSlice: StateCreator<SessionSlice & SettingsSlice & ProductSlice, [], [], SettingsSlice> = (
	set,
	get
) => ({
	debug: false,
	loaded: false,
	loadedSettings: false,
	loadSettings: async () => {
		const { addWarn, loaded } = get();
		addWarn("Loading Settings...");
		if (isTauriApp() && !loaded) {
			const { saveSettings } = get();
			const { appDataDir, join } = await import("@tauri-apps/api/path");
			const { readTextFile, exists } = await import("@tauri-apps/plugin-fs");
			const appDataDirPath = await appDataDir();
			const settingsJSONPath = await join(appDataDirPath, "settings.json");
			if (await exists(settingsJSONPath)) {
				const settingsFile = await readTextFile(settingsJSONPath).catch(() => "");
				if (settingsFile.trim() === "") {
					console.warn(`Couldn't find the settings file at ${settingsJSONPath}, creating a new one...`);
					await saveSettings();
					return;
				}
				const settingsJSON: SettingsSlice = JSON.parse(settingsFile);

				const { debug } = settingsJSON;

				set({
					debug
				});

				await saveSettings();
				set({ loaded: true });
			} else {
				console.warn(`Couldn't find the settings file at ${settingsJSONPath}, creating a new one...`);
				console.info(`Settings cache created at ${settingsJSONPath}`);
			}

			set({ loaded: true });
		}
	},
	saveSettings: (delay?: number) =>
		new Promise(resolve => {
			const save = debounce(async () => {
				if (isTauriApp()) {
					const { debug } = get();
					const { appDataDir, join } = await import("@tauri-apps/api/path");
					const { writeTextFile, remove } = await import("@tauri-apps/plugin-fs");
					const appDataDirPath = await appDataDir();
					const settingsJSONPath = await join(appDataDirPath, "settings.json");
					await remove(settingsJSONPath).catch(() => {});
					await writeTextFile(
						settingsJSONPath,
						JSON.stringify(
							{
								debug
							},
							null,
							4
						)
					)
						.catch(() => {
							resolve(false);
						})
						.then(() => {
							resolve(true);
						});
				} else {
					get().addWarn("Not running in Tauri, can't save settings");
				}
				resolve(false);
			}, delay ?? 500);
			save();
		}),
	changeDebug: async (value: boolean) => {
		set({ debug: value });
		const { saveSettings } = get();
		await saveSettings();
	}
});
