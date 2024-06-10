import { SessionProvider } from "@/contexts/SessionContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Botillería La Tía | Panel de administración",
	description: "La mejor botillería de Santiago"
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <SessionProvider>{children}</SessionProvider>;
}
