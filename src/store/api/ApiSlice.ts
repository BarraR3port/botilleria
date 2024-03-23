import axios, { type AxiosInstance } from "axios";
import type { StateCreator } from "zustand";
import type { ProjectArtSlice } from "../app/ProjectArtSlice";
import type { ProjectSlice } from "../app/ProjectSlice";
import type { SessionSlice } from "../app/SessionSlice";
import type { SettingsSlice } from "../app/SettingsSlice";
import type { SkinSlice } from "../app/SkinSlice";
import type { UserSlice } from "../app/UserSlice";
import type { AuthApiSlice } from "./AuthApiSlice";
import type { UserApiSlice } from "./UserApiSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
	baseURL: API_URL,
	timeout: 8000,
});

api.interceptors.response.use(
	response => response,
	error => {
		if (error.response) {
			return Promise.reject({
				...error.response.data,
				method: error.config.method,
				url: error.config.url,
				params: error.config.params,
				data: error.config.data,
			});
		}
		return Promise.reject(error.message);
	},
);

export interface ApiSlice {
	api: AxiosInstance;
	handleAxiosResponse: (response: any) => any;
}

export const createApiSlice: StateCreator<
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
	ApiSlice
> = (_set, _get) => ({
	api,
	handleAxiosResponse: response => {
		if (!response) {
			return undefined;
		}
		if (response.status === 200 || response.status === 201) {
			return response.data;
		}
		throw new Error("Error with request Status:", response.status);
	},
});
