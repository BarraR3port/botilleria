import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type SessionSlice, createSessionSlice } from "./app/SessionSlice";
import { type SettingsSlice, createSettingsSlice } from "./app/SettingsSlice";

import { type ApiSlice, createApiSlice } from "./api/ApiSlice";
import { type AuthApiSlice, createAuthApiSlice } from "./api/AuthApiSlice";
import { type UserApiSlice, createUserApiSlice } from "./api/UserApiSlice";
import { type UserSlice, createUserSlice } from "./app/UserSlice";

export const useAppStore = create<SessionSlice & UserSlice & SettingsSlice & ApiSlice & UserApiSlice & AuthApiSlice>()(
	persist(
		(...a) => ({
			...createSessionSlice(...a),
			...createUserSlice(...a),
			...createSettingsSlice(...a),
			// API SLICES
			...createApiSlice(...a),
			...createAuthApiSlice(...a),
			...createUserApiSlice(...a)
		}),
		{
			name: "mc-pack-store",
			storage: createJSONStorage(() => localStorage)
		}
	)
);
