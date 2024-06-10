import { auth } from "@/auth/ServerAuth";
import { useRouter } from "next/router";

interface RouteProtectorProps {
	children: React.ReactNode;
}

export default async function RouteProtector({ children }: RouteProtectorProps) {
	/*const router = useRouter();
	 const { user, backendTokens } = await auth();

	if (!user || !backendTokens || backendTokens.accessToken.expireAt < Date.now()) {
		router.replace("/signIn");
		return null;
	} */
	return <>{children}</>;
}
