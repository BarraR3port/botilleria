import { toast } from "@/components/ui/use-toast";
import type { BackendTokens, Notification, User, UserResponse } from "@/lib/Objects/User";
import type {
	SignInFromType,
	SignUpFromType,
	UpdateBasicUserInfoFormType,
	UpdateCriticalUserInfoFormType,
} from "@/schemas/authSchema";
import type { Session } from "next-auth";
import { signIn as signInNextAuth, signOut as signOutNextAuth } from "next-auth/react";
import type { StateCreator } from "zustand";
import type { ApiSlice } from "../api/ApiSlice";
import type { AuthApiSlice } from "../api/AuthApiSlice";
import type { UserApiSlice } from "../api/UserApiSlice";
import type { ProjectArtSlice } from "./ProjectArtSlice";
import type { ProjectSlice } from "./ProjectSlice";
import type { SessionSlice } from "./SessionSlice";
import type { SettingsSlice } from "./SettingsSlice";
import type { SkinSlice } from "./SkinSlice";

export interface UserSlice {
	backendTokens: BackendTokens | null;
	user: User | null;
	expiresIn: string | null;
	signedIn: boolean;
	loggingIn: boolean;
	signingOut: boolean;
	notifications: Notification[];
	requestForceRefreshHook: boolean;
	signIn: (signInForm: SignInFromType) => Promise<boolean | "need-verification">;
	signUp: (signUpForm: SignUpFromType) => Promise<boolean>;
	verifyUserEmail: (email: string, token: string, password: string) => Promise<boolean>;
	signOut: () => void;
	updateBasicUserInfo: (updateUserForm: UpdateBasicUserInfoFormType) => Promise<boolean>;
	updateCriticalUserInfo: (updateUserForm: UpdateCriticalUserInfoFormType) => Promise<boolean>;
	addNotification: (notification: Notification) => void;
	clearNotifications: () => void;
	clearData(): void;
	clearBasicData(): void;
	setSession: (session: Session) => void;
}

export const createUserSlice: StateCreator<
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
	UserSlice
> = (set, get) => ({
	backendTokens: null,
	user: null,
	expiresIn: null,
	loggingIn: false,
	signedIn: false,
	requestForceRefreshHook: false,
	notifications: [],
	signingOut: false,
	signIn: async (signInForm: SignInFromType) => {
		const nextAuthResponse = await signInNextAuth(
			"credentials",
			{
				redirect: false,
				...signInForm,
			},
			signInForm,
		);

		if (!nextAuthResponse) {
			toast({
				title: "Error",
				description: "An error occurred while signing in. Please try again.",
			});
			return false;
		}

		if ("error" in nextAuthResponse && nextAuthResponse.error) {
			if (nextAuthResponse.error === "auth.errors.email.notVerified") {
				return "need-verification";
			}
			toast({
				title: nextAuthResponse.error,
				variant: "destructive",
			});
			return false;
		}

		if (nextAuthResponse.ok) {
			return true;
		}
		return false;
	},
	signUp: async (signUpForm: SignUpFromType) => {
		const { signUpUser } = get();
		const userResponse = await signUpUser(signUpForm);
		if (!userResponse) {
			toast({
				title: "Error",
				description: "An error occurred while signing up. Please try again.",
			});
			return false;
		}
		if ("errors" in userResponse) {
			userResponse.errors.forEach(error => {
				toast({
					title: error.message,
					variant: "destructive",
				});
			});
			return false;
		}
		return true;
	},
	verifyUserEmail: async (email: string, token: string, password: string) => {
		const { verifyEmail } = get();
		const userResponse = await verifyEmail(email, token);
		if (!userResponse) {
			toast({
				title: "Error",
				description: "An error occurred while verifying your email. Please try again.",
			});
			return false;
		}
		if ("errors" in userResponse) {
			userResponse.errors.forEach(error => {
				toast({
					title: error.message,
					variant: "destructive",
				});
			});
			return false;
		}

		const nextAuthResponse = await signInNextAuth("credentials", {
			redirect: false,
			email,
			password,
		});

		if (!nextAuthResponse) {
			toast({
				title: "Error",
				description: "An error occurred while signing in. Please try again.",
			});
			return false;
		}

		if ("error" in nextAuthResponse && nextAuthResponse.error) {
			toast({
				title: nextAuthResponse.error,
				variant: "destructive",
			});
			return false;
		}

		if (nextAuthResponse.ok) {
			return true;
		}
		return false;
	},
	signOut: async () => {
		const { signOutUser } = get();
		set({
			signingOut: true,
		});
		await signOutUser()
			.then(() => {
				set({
					loggingIn: false,
					requestForceRefreshHook: false,
					notifications: [],
					signedIn: false,
					backendTokens: null,
				});
			})
			.finally(async () => {
				await signOutNextAuth();
			});
	},
	updateBasicUserInfo: async (updateUserForm: UpdateBasicUserInfoFormType): Promise<boolean> => {
		const { updateBasicUserInfoToApi, user } = get();
		const updateResponse = await updateBasicUserInfoToApi(updateUserForm);
		if (!updateResponse || !user) {
			return false;
		}
		return true;
	},
	updateCriticalUserInfo: async (updateUserForm: UpdateCriticalUserInfoFormType): Promise<boolean> => {
		const { updateCriticalUserInfoToApi, user } = get();
		const updateResponse = await updateCriticalUserInfoToApi(updateUserForm);
		if (!updateResponse || !user) {
			return false;
		}

		const nextAuthResponse = await signInNextAuth("credentials", {
			redirect: false,
			email: user.email,
			password: updateUserForm.password,
		});

		if (!nextAuthResponse) {
			toast({
				title: "Error",
				description: "An error occurred while signing in. Please try again.",
			});
			return false;
		}

		if ("error" in nextAuthResponse && nextAuthResponse.error) {
			toast({
				title: nextAuthResponse.error,
				variant: "destructive",
			});
			return false;
		}

		if (nextAuthResponse.ok) {
			return true;
		}
		return false;
	},
	clearData: () => {
		console.warn("Clearing DATA!!!!!");
		set({
			loggingIn: false,
			requestForceRefreshHook: false,
			notifications: [],
			backendTokens: null,
		});
	},
	clearBasicData: () => {},
	addNotification: notification => {
		const { notifications } = get();
		set({
			notifications: [...notifications, notification],
		});
	},
	clearNotifications: () => {
		set({
			notifications: [],
		});
	},
	setSession: session => {
		set({
			backendTokens: session.backendTokens,
			user: session.user,
			expiresIn: session.expires,
		});
	},
});
