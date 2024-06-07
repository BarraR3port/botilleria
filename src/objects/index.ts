export type BackendToken = {
	token: string;
	expireAt: number;
};

export type BackendTokens = {
	accessToken: BackendToken;
	refreshToken: BackendToken;
};

export type UserAuthData = {
	user: User;
	backendTokens: BackendTokens;
};

type ErrorType = "email" | "password" | "token" | "unknown";

export interface UserAuthError {
	type: "email" | "password" | "token";
	message: string;
}

export type UserErrorResponse = {
	type: ErrorType;
	errors: UserAuthError[];
};

export type NextErrorResponse = {
	response: {
		status: number;
		data: UserErrorResponse;
	};
};

export type ApiResponse = UserErrorResponse | "" | undefined | true;

export type AuthResponse = UserAuthData | ApiResponse;

export interface User {
	id: string;
	email: string;
	name: string;
	lastName: string;
	createdAt: Date;
	updatedAt: Date;
	rol: "ADMIN" | "USER";
	emailVerified: Date | null;
	backendTokens: BackendTokens;
}
