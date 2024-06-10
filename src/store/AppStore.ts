import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type SessionSlice, createSessionSlice } from "./app/SessionSlice";
import { type SettingsSlice, createSettingsSlice } from "./app/SettingsSlice";
import { type ProductSlice, createProductSlice } from "./app/ProductSlice";

export const useAppStore = create<SessionSlice & SettingsSlice & ProductSlice>()(
	persist(
		(...a) => ({
			...createSessionSlice(...a),
			...createSettingsSlice(...a),
			...createProductSlice(...a)
		}),
		{
			name: "app-store",
			storage: createJSONStorage(() => localStorage)
		}
	)
);
