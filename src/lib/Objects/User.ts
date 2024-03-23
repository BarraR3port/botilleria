export type User = {
	id: string;
	lastName: string;
	firstName: string;
	company: string;
	email: string;
};

export type BackendTokens = {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
};

export interface Notification {
	type: NotificationType;
	dateReceived: Date;
	seen: boolean;
}

export type NotificationType =
	| "follow"
	| "like"
	| "comment"
	| "message"
	| "newParty"
	| "partyUpdate"
	| "partyDelete"
	| "groupInvite"
	| "group"
	| "groupNewMember"
	| "partyInvite"
	| "partyNewMember";

type ErrorType = "email" | "password" | "token" | "unknown";

export type UserErrorResponse = {
	type: ErrorType;
	errors: UserAuthError[];
};

type NestResponse = {
	message: string[];
	error: string;
	data: string;
	method: string;
	params: any;
	statusCode: number;
	url: string;
};

export type UserResponse = UserErrorResponse | NestResponse | "" | undefined;

export interface UserAuthError {
	type: "email" | "password" | "token";
	message: string;
}
