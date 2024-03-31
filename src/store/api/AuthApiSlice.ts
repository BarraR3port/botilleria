import type { UserResponse } from "@/lib/Objects/User";
import type { SignInFromType, SignUpFromType } from "@/schemas/authSchema";
import type { StateCreator } from "zustand";
import type { SessionSlice } from "../app/SessionSlice";
import type { SettingsSlice } from "../app/SettingsSlice";
import type { UserSlice } from "../app/UserSlice";
import type { ApiSlice } from "./ApiSlice";
import type { UserApiSlice } from "./UserApiSlice";

export interface AuthApiSlice {
	signInUser: (signInForm: SignInFromType) => Promise<UserResponse>;
	signUpUser: (signUpForm: SignUpFromType) => Promise<UserResponse>;
	register: (signUpForm: SignUpFromType) => Promise<UserResponse>;
	verifyEmail: (email: string, token: string) => Promise<UserResponse>;
	signOutUser: () => Promise<void>;
	fetchRefreshToken: () => Promise<UserResponse>;
}

export const createAuthApiSlice: StateCreator<
	SessionSlice & UserSlice & SettingsSlice & ApiSlice & UserApiSlice & AuthApiSlice,
	[],
	[],
	AuthApiSlice
> = (_, get) => ({
	signInUser: async (signInForm: SignInFromType) => {
		const { api, handleAxiosResponse } = get();
		return await api.post("/auth/signIn", signInForm).then(handleAxiosResponse);
	},
	signUpUser: async (signUpForm: SignUpFromType) => {
		const { api, handleAxiosResponse } = get();
		return await api.post("/auth/signUp", signUpForm).then(handleAxiosResponse);
	},
	signOutUser: async () => {
		const { api, backendTokens, handleAxiosResponse } = get();
		if (!backendTokens) {
			return;
		}
		return await api
			.post("/auth/signOut", null, {
				headers: {
					Authorization: `Bearer ${backendTokens.accessToken}`
				}
			})
			.then(handleAxiosResponse);
	},
	fetchRefreshToken: async () => {
		const { api, backendTokens } = get();
		if (!backendTokens) {
			return;
		}
		return await api
			.post("/auth/refresh-token", null, {
				headers: {
					Authorization: `Bearer ${backendTokens.refreshToken}`
				}
			})
			.then(response => {
				if (response?.status === 201) {
					return response.data;
				}
				throw new Error();
			});
	},
	register: async (signUpForm: SignUpFromType) => {
		const { api, handleAxiosResponse } = get();
		return await api.post("/auth/register", signUpForm).then(handleAxiosResponse);
	},
	verifyEmail: async (email: string, token: string) => {
		const { api, handleAxiosResponse } = get();
		return await api
			.post("/auth/verify-email", {
				token,
				email
			})
			.then(handleAxiosResponse);
	}
});
