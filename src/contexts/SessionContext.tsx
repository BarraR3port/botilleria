"use client";

import type React from "react";
import { createContext, useContext, useEffect } from "react";

import Loading from "@/components/store/loading";
import { useAppStore } from "@/store/AppStore";
import { usePathname, useRouter } from "next/navigation";

const SessionContext = createContext({});

export const useSession = () => useContext(SessionContext);

type SessionProviderProps = {
	children: React.ReactNode;
};

export const SessionProvider = ({ children }: SessionProviderProps) => {
	const { getSession, session, loadingSession } = useAppStore();
	const router = useRouter();
	const pathName = usePathname();

	useEffect(() => {
		if (loadingSession) {
			return;
		}
		if (getSession() === null) {
			router.push("/signIn");
		}
	}, [getSession, session, loadingSession, pathName]);

	if (loadingSession && session !== null) {
		return <Loading />;
	}

	if (loadingSession && session === null) {
		return <Loading />;
	}

	if (!loadingSession && session === null) {
		return <Loading />;
	}

	return <SessionContext.Provider value={{}}>{children}</SessionContext.Provider>;
};
