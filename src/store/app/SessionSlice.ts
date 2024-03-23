import { redirect } from "next/navigation";
import type { StateCreator } from "zustand";
import { debug, error, getTime, info, warn } from "../../lib/Objects/LogManager";
import { PackType, type Project } from "../../lib/Objects/Project";
import type { CurrentProject, Session } from "../../lib/Objects/Session";
import { STEVE_SKIN } from "../../lib/Objects/Skin";
import type { ApiSlice } from "../api/ApiSlice";
import type { AuthApiSlice } from "../api/AuthApiSlice";
import type { UserApiSlice } from "../api/UserApiSlice";
import type { ProjectArtSlice } from "./ProjectArtSlice";
import type { ProjectSlice } from "./ProjectSlice";
import type { SettingsSlice } from "./SettingsSlice";
import type { SkinSlice } from "./SkinSlice";
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
	saveAllData: (project?: Project) => Promise<void>;
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
	SessionSlice &
		UserSlice &
		ProjectArtSlice &
		SettingsSlice &
		SkinSlice &
		ProjectSlice &
		ApiSlice &
		UserApiSlice &
		AuthApiSlice,
	[],
	[],
	SessionSlice
> = (set, get) => ({
	user: null,
	loadedSession: false,
	sessionUUID: "",
	currentProject: undefined as CurrentProject | undefined,
	session: null,
	packType: PackType.NONE,
	checkNewVersion: false,
	downloadNewVersion: false,
	foundNewVersion: false,
	outputLogs: [],
	loadSession: async () => {
		const { sessionUUID: uuid, saveAllData, loadedSession } = get();

		if (!!false && !loadedSession) {
			const { invoke } = await import("@tauri-apps/api/tauri");
			const { appDataDir, join } = await import("@tauri-apps/api/path");
			const { exists, readTextFile } = await import("@tauri-apps/api/fs");
			let sessionUUID = uuid;
			if (sessionUUID === "") {
				sessionUUID = await invoke("get_session_uuid", {}).then(async response =>
					typeof response === "string" ? response : "",
				);
				set({
					sessionUUID,
					loadedSession: true,
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
					backendTokens: sessionJSON,
					loadedSession: true,
				});
			} else {
				await saveAllData();
				set({
					loadedSession: true,
				});
			}
		}
	},
	saveAllData: async () => {
		const { saveSession, saveProject } = get();
		await saveSession();
		await saveProject();
	},
	saveSession: async () => {
		const { loadedSession, sessionUUID: uuid, backendTokens: session, createSession, project } = get();
		if (!!false && loadedSession) {
			const { appDataDir, join } = await import("@tauri-apps/api/path");
			const { invoke } = await import("@tauri-apps/api/tauri");
			const { exists, BaseDirectory, createDir, writeTextFile } = await import("@tauri-apps/api/fs");
			let sessionUUID = uuid;
			if (sessionUUID === "") {
				sessionUUID = await invoke("get_session_uuid", {}).then(async response =>
					typeof response === "string" ? response : "",
				);
				set({ sessionUUID });
			}
			const appDataDirPath = await appDataDir();
			const sessionJsonPath = await join(appDataDirPath, "Sessions", sessionUUID, "session.json");
			await exists(sessionJsonPath).then(async exists => {
				if (!exists) {
					await createDir(sessionJsonPath, {
						dir: BaseDirectory.AppData,
						recursive: true,
					});
				}
			});
			if (session === undefined) {
				set({ backendTokens: createSession() });
			}
			const sessionJSON = JSON.stringify({ ...session, project }, null, 4);
			await writeTextFile(sessionJsonPath, sessionJSON);
		}
	},
	createSession: () => {
		const { sessionUUID: uuid, currentProject } = get();
		return {
			uuid,
			changed: false,
			current_project: currentProject,
		} as Session;
	},
	setOutputLogs: (outputLogs: OutputLog[]) => {
		set({
			outputLogs,
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
		const { redirectTo, project, defaultPartnerArt, defaultPartnerArtEnabled } = get();
		if (project !== null && project.skinPack !== null) {
			project.skinPack.skinList.forEach(skin => URL.revokeObjectURL(skin.url_blob_path));
		}
		set(state => ({
			...state,
			project: null,
			currentProject: undefined,
			packType: PackType.NONE,
			steps: [0],
			currentStep: 0,
			sidebarSteps: {
				title: ["packType"],
				stepsPath: ["/project"],
				color: "#FDFEFE",
			},
			checkNewVersion: false,
			downloadNewVersion: false,
			foundNewVersion: false,
			newVersion: undefined,
			skin: STEVE_SKIN,
			options: {
				model: "slim",
				pixelRatio: "match-device",
				background: "#17181C",
			},
			outputLogs: [],
			viewer: null,
			editingSkin: null,
			defaultPartnerArt,
			defaultPartnerArtEnabled,
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
					message: message + objects.map(object => JSON.stringify(object, null, 4)).join(" "),
				},
			],
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
					message: message + objects.map(object => JSON.stringify(object, null, 4)).join(" "),
				},
			],
		}));
	},
	addInfo: (message: string, ...objects: any[]) => {
		set(state => ({
			...state,
			outputLogs: [
				...state.outputLogs,
				{
					type: "INFO",
					message: message + objects.map(object => JSON.stringify(object, null, 4)).join(" "),
				},
			],
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
					message: message + objects.map(object => JSON.stringify(object, null, 4)).join(" "),
				},
			],
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
					message: message + objects.map(object => JSON.stringify(object, null, 4)).join(" "),
				},
			],
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
			`${name} [END] ` + `${responseTime.minutes}m : ${responseTime.seconds}s : ${responseTime.milliseconds}ms`,
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
	},
});
