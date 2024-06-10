import type { UserSession } from "@/objects";
import axios from "axios";
import type { StateCreator } from "zustand";
import { debug, error, info, warn } from "../../lib/Objects/LogManager";
import type { ProductSlice } from "./ProductSlice";
import type { SettingsSlice } from "./SettingsSlice";

export type LogType = "INFO" | "ERROR" | "WARN" | "DEBUG";

export interface OutputLog {
	type: LogType;
	message: string;
}

export type SessionSlice = {
	outputLogs: OutputLog[];
	session: UserSession | null;
	loadingSession: boolean;
	updateSession: (session: UserSession) => void;
	loadSession: () => Promise<void>;
	getSession: () => UserSession | null;
	logOut: () => void;
	addError: (error: string, ...objects: any[]) => void;
	addInfo: (info: string, ...objects: any[]) => void;
	addWarn: (info: string, ...objects: any[]) => void;
	addDebug: (info: string, ...objects: any[]) => void;
	addLog: (info: string, type: LogType, ...objects: any[]) => void;
};

export const createSessionSlice: StateCreator<SessionSlice & SettingsSlice & ProductSlice, [], [], SessionSlice> = (
	set,
	get
) => ({
	outputLogs: [],
	session: null,
	loadingSession: false,
	updateSession: (session: UserSession) => {
		set(state => ({
			...state,
			session
		}));
	},
	loadSession: async () => {
		const { addDebug, session } = get();
		set(state => ({
			...state,
			loadingSession: true
		}));
		if (!session) {
			set(state => ({
				...state,
				loadingSession: false
			}));
			return;
		}
		if (session.backendTokens.accessToken.expireAt < Date.now()) {
			set(state => ({
				...state,
				loadingSession: false
			}));
			return;
		}
		if (session.backendTokens.refreshToken.expireAt < Date.now()) {
			set(state => ({
				...state,
				loadingSession: false
			}));
			return;
		}
		await axios
			.post(
				`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
				{},
				{
					headers: {
						Authorization: `Bearer ${session.backendTokens.refreshToken.token}`
					}
				}
			)
			.catch(err => {
				addDebug("|| Session -|- Refresh Token Error:", err);
				set(state => ({
					...state,
					loadingSession: false
				}));
			})
			.then(res => {
				if (res && "data" in res && "user" in res.data && "backendTokens" in res.data) {
					set(state => ({
						...state,
						session: res.data
					}));
				}
				set(state => ({
					...state,
					loadingSession: false
				}));
			});
	},
	getSession: () => {
		const { session, updateSession, addDebug, addError } = get();
		if (!session) return null;
		if (session.backendTokens.accessToken.expireAt < Date.now()) {
			addError("|| Session -|- Access Token Expired");
			if (session.backendTokens.refreshToken.expireAt < Date.now()) {
				addError("|| Session -|- Refresh Token Expired");
				return null;
			}
			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
					{},
					{
						headers: {
							Authorization: `Bearer ${session.backendTokens.refreshToken.token}`
						}
					}
				)
				.catch(err => {
					addError("|| Session -|- Refresh Token Error:", err);
					return null;
				})
				.then(res => {
					if (!res) return null;
					session.backendTokens.accessToken = res.data.accessToken;
					session.backendTokens.refreshToken = res.data.refreshToken;
					updateSession(session);
					addDebug("|| Session -|- Refresh Token Success");
				});
			return null;
		}

		return session;
	},
	logOut: () => {
		set(state => ({
			...state,
			session: null
		}));
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
	}
});
