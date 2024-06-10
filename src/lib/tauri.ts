"use client";
//@ts-ignore
export const isTauriApp = () => {
	if (typeof window !== "undefined") {
		return false;
	}
	return true;
};
