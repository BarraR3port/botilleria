import { redirect } from "next/navigation";
import type { StateCreator } from "zustand";
import { debug, error, getTime, info, warn } from "../../lib/Objects/LogManager";
import type { CurrentProject, Session } from "../../lib/Objects/Session";
import type { ApiSlice } from "../api/ApiSlice";
import type { AuthApiSlice } from "../api/AuthApiSlice";
import type { UserApiSlice } from "../api/UserApiSlice";
import type { SettingsSlice } from "./SettingsSlice";
import type { UserSlice } from "./UserSlice";

export type LogType = "INFO" | "ERROR" | "WARN" | "DEBUG";

export interface OutputLog {
	type: LogType;
	message: string;
}

export type SessionSlice = {
	loadedSession: boolean;
	checkNewVersion: boolean;
	downloadNewVersion: boolean;
	sessionUUID: string;
	foundNewVersion: boolean;
	session: Session | null;
	outputLogs: OutputLog[];
	loadSession: () => Promise<void>;
	saveAllData: () => Promise<void>;
	saveSession: () => Promise<void>;
	createSession: () => Session;
	setOutputLogs: (outputLogs: OutputLog[]) => void;
	addLogByType: (type: LogType, message: string, ...obects: any[]) => void;
	setFoundNewVersion: (checkNewVersion: boolean) => void;
	setCheckNewVersion: (checkNewVersion: boolean) => void;
	setDownloadNewVersion: (downloadNewVersion: boolean) => void;
	redirectTo: (to: string) => Promise<boolean>;
	resetSession: (redirectToHome?: boolean) => void;
	addError: (error: string, ...objects: any[]) => void;
	addInfo: (info: string, ...objects: any[]) => void;
	addWarn: (info: string, ...objects: any[]) => void;
	addDebug: (info: string, ...objects: any[]) => void;
	addLog: (info: string, type: LogType, ...objects: any[]) => void;
	executePerformanceTest: <T>(type: LogType, name: string, fun: () => Promise<T>) => Promise<T>;
};

export const createSessionSlice: StateCreator<
	SessionSlice & UserSlice & SettingsSlice & ApiSlice & UserApiSlice & AuthApiSlice,
	[],
	[],
	SessionSlice
> = (set, get) => ({
	user: null,
	loadedSession: false,
	sessionUUID: "",
	currentProject: undefined as CurrentProject | undefined,
	session: null,
	checkNewVersion: false,
	downloadNewVersion: false,
	foundNewVersion: false,
	outputLogs: [],
	loadSession: async () => {
		const { sessionUUID: uuid, saveAllData, loadedSession } = get();

		if (!!false && !loadedSession) {
			const { invoke } = await import("@tauri-apps/api/core");
			const { appDataDir, join } = await import("@tauri-apps/api/path");
			const { exists, readTextFile } = await import("@tauri-apps/plugin-fs");
			let sessionUUID = uuid;
			if (sessionUUID === "") {
				sessionUUID = await invoke("get_session_uuid", {}).then(async response =>
					typeof response === "string" ? response : ""
				);
				set({
					sessionUUID,
					loadedSession: true
				});
			}
			const appDataDirPath = await appDataDir();
			const sessionJSONPath = await join(appDataDirPath, "Sessions", sessionUUID, "session.json");
			if (await exists(sessionJSONPath)) {
				const sessionFile = await readTextFile(sessionJSONPath).catch(() => "");
				if (sessionFile.trim() === "") {
					return;
				}
				const sessionJSON: Session = JSON.parse(sessionFile);
				set({
					session: sessionJSON,
					loadedSession: true
				});
			} else {
				await saveAllData();
				set({
					loadedSession: true
				});
			}
		}
	},
	saveAllData: async () => {
		const { saveSession } = get();
		await saveSession();
	},
	saveSession: async () => {
		const { loadedSession, sessionUUID: uuid, backendTokens: session, createSession } = get();
		if (!!false && loadedSession) {
			const { appDataDir, join } = await import("@tauri-apps/api/path");
			const { invoke } = await import("@tauri-apps/api/core");
			const { exists, BaseDirectory, mkdir, writeTextFile } = await import("@tauri-apps/plugin-fs");
			let sessionUUID = uuid;
			if (sessionUUID === "") {
				sessionUUID = await invoke("get_session_uuid", {}).then(async response =>
					typeof response === "string" ? response : ""
				);
				set({ sessionUUID });
			}
			const appDataDirPath = await appDataDir();
			const sessionJsonPath = await join(appDataDirPath, "Sessions", sessionUUID, "session.json");
			await exists(sessionJsonPath).then(async exists => {
				if (!exists) {
					await mkdir(sessionJsonPath, {
						baseDir: BaseDirectory.AppData,
						recursive: true
					});
				}
			});
			if (session === undefined) {
				set({ session: createSession() });
			}
			const sessionJSON = JSON.stringify({ ...session }, null, 4);
			await writeTextFile(sessionJsonPath, sessionJSON);
		}
	},
	createSession: () => {
		const { sessionUUID: uuid } = get();
		return {
			uuid,
			changed: false
		} as Session;
	},
	setOutputLogs: (outputLogs: OutputLog[]) => {
		set({
			outputLogs
		});
	},
	setFoundNewVersion: (foundNewVersion: boolean) => {
		set({ foundNewVersion });
	},
	setCheckNewVersion: (checkNewVersion: boolean) => {
		set({ checkNewVersion });
	},
	setDownloadNewVersion: (downloadNewVersion: boolean) => {
		set({ downloadNewVersion });
	},
	redirectTo: async (to: string) => {
		redirect(to);
	},
	resetSession: (redirectToHome?: boolean) => {
		const { redirectTo } = get();

		set(state => ({
			...state,
			checkNewVersion: false,
			downloadNewVersion: false,
			foundNewVersion: false,
			newVersion: undefined,
			outputLogs: []
		}));
		if (redirectToHome) {
			redirectTo("/");
		}
	},
	addError: (message: string, ...objects: any[]) => {
		set(state => ({
			...state,
			outputLogs: [
				...state.outputLogs,
				{
					type: "ERROR",
					message: message + objects.map(object => JSON.stringify(object, null, 4)).join(" ")
				}
			]
		}));
		error(message, objects);
	},
	addLog: (message: string, type: LogType, ...objects: any[]) => {
		set(state => ({
			...state,
			outputLogs: [
				...state.outputLogs,
				{
					type,
					message: message + objects.map(object => JSON.stringify(object, null, 4)).join(" ")
				}
			]
		}));
	},
	addInfo: (message: string, ...objects: any[]) => {
		set(state => ({
			...state,
			outputLogs: [
				...state.outputLogs,
				{
					type: "INFO",
					message: message + objects.map(object => JSON.stringify(object, null, 4)).join(" ")
				}
			]
		}));
		info(message, objects);
	},
	addWarn: (message: string, ...objects: any[]) => {
		set(state => ({
			...state,
			outputLogs: [
				...state.outputLogs,
				{
					type: "WARN",
					message: message + objects.map(object => JSON.stringify(object, null, 4)).join(" ")
				}
			]
		}));
		warn(message, objects);
	},
	addDebug: (message: string, ...objects: any[]) => {
		set(state => ({
			...state,
			outputLogs: [
				...state.outputLogs,
				{
					type: "DEBUG",
					message: message + objects.map(object => JSON.stringify(object, null, 4)).join(" ")
				}
			]
		}));
		debug(message, objects);
	},
	async executePerformanceTest<T>(type: LogType, name: string, fun: () => Promise<T>): Promise<T> {
		const { addLogByType } = get();
		const start = performance.now();
		addLogByType(type, `${name} [START]`);
		const result = await fun();
		const responseTime = getTime(start, performance.now());
		addLogByType(
			type,
			`${name} [END] ` + `${responseTime.minutes}m : ${responseTime.seconds}s : ${responseTime.milliseconds}ms`
		);
		return result;
	},
	addLogByType(type: LogType, message: string, ...objects: any[]) {
		const { addInfo, addError, addWarn, addDebug } = get();
		switch (type) {
			case "INFO": {
				addInfo(message, ...objects);
				break;
			}
			case "ERROR": {
				addError(message, ...objects);
				break;
			}
			case "WARN": {
				addWarn(message, ...objects);
				break;
			}
			case "DEBUG": {
				addDebug(message, ...objects);
				break;
			}
		}
	}
});
