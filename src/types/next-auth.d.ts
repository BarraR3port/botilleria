import type { BackendTokens, User } from "@/lib/Objects/User";
import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		user: User;
		backendTokens: BackendTokens;
	}
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
	interface JWT {
		user: User;

		backendTokens: BackendTokens;
	}
}
