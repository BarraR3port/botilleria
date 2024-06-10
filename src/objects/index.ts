export type BackendToken = {
	token: string;
	expireAt: number;
};

export type BackendTokens = {
	accessToken: BackendToken;
	refreshToken: BackendToken;
};

export type UserSession = {
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

export type AuthResponse = UserSession | ApiResponse;

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

export interface Recovery {
	id: string;
	token: string;
	status: "WAITING" | "USED" | "EXPIRED";
	createdAt: Date;
	updatedAt: Date;
	email: string;
}
