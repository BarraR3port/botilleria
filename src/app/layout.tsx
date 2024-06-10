import "@/styles/globals.css";
import type { Metadata } from "next";

import { Greeting } from "@/components/greeting";
import { Menu } from "@/components/menu";
import { StyleSwitcher } from "@/components/style-switcher";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

interface ExamplesLayoutProps {
	children: React.ReactNode;
}

export default function MyApp({ children }: ExamplesLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning className="bg-black overflow-clip">
			<head />
			<body className="font-sans antialiased bg-transparent overflow-clip scrollbar-none">
				<Greeting />
				<ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
					<div className="h-screen overflow-clip">
						<Menu />
						<div
							className={cn(
								"h-screen overflow-auto border-t bg-background pb-8",
								// "scrollbar-none"
								"scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md"
							)}
						>
							{children}
						</div>
					</div>
					<TailwindIndicator />
				</ThemeProvider>
				<StyleSwitcher />
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	title: "Botilleria",
	icons: {
		shortcut: ["#"]
	}
};
