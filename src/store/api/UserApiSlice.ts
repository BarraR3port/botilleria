import type { UpdateBasicUserInfoFormType, UpdateCriticalUserInfoFormType } from "@/schemas/authSchema";
import type { StateCreator } from "zustand";
import type { SessionSlice } from "../app/SessionSlice";
import type { SettingsSlice } from "../app/SettingsSlice";
import type { UserSlice } from "../app/UserSlice";
import type { ApiSlice } from "./ApiSlice";
import type { AuthApiSlice } from "./AuthApiSlice";

export interface UserApiSlice {
	checkUsername: (username: string) => Promise<boolean>;
	updateCriticalUserInfoToApi: (
		user: UpdateCriticalUserInfoFormType
	) => Promise<UpdateCriticalUserInfoFormType | undefined>;
	updateBasicUserInfoToApi: (user: UpdateBasicUserInfoFormType) => Promise<UpdateBasicUserInfoFormType | undefined>;
}

export const createUserApiSlice: StateCreator<
	SessionSlice & UserSlice & SettingsSlice & ApiSlice & UserApiSlice & AuthApiSlice,
	[],
	[],
	UserApiSlice
> = (_, get) => ({
	checkUsername: async (username: string): Promise<boolean> => {
		const { api, backendTokens, handleAxiosResponse } = get();
		if (!backendTokens) return false;
		return api
			.get(`/user/check-username/${username}`, {
				headers: {
					Authorization: `Bearer ${backendTokens.accessToken}`
				}
			})
			.then(handleAxiosResponse);
	},
	updateCriticalUserInfoToApi: async (
		user: UpdateCriticalUserInfoFormType
	): Promise<UpdateCriticalUserInfoFormType | undefined> => {
		const { api, handleAxiosResponse, backendTokens } = get();
		if (!backendTokens || !user) return undefined;
		return api
			.post("/user/update", user, {
				headers: {
					Authorization: `Bearer ${backendTokens.accessToken}`
				}
			})
			.then(handleAxiosResponse);
	},
	updateBasicUserInfoToApi: async (
		user: UpdateBasicUserInfoFormType
	): Promise<UpdateBasicUserInfoFormType | undefined> => {
		const { api, handleAxiosResponse, backendTokens } = get();
		if (!backendTokens || !user) return undefined;
		return api
			.post("/user/update", user, {
				headers: {
					Authorization: `Bearer ${backendTokens.accessToken}`
				}
			})
			.then(handleAxiosResponse);
	}
});
