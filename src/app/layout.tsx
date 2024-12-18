import "@/styles/globals.css";
import type { Metadata } from "next";

import { Menu } from "@/components/menu";
import { StyleSwitcher } from "@/components/style-switcher";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/contexts/SessionContext";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ExamplesLayoutProps {
	children: React.ReactNode;
}

export default function MyApp({ children }: ExamplesLayoutProps) {
	return (
		<html lang="es" suppressHydrationWarning className="overflow-clip">
			<head />
			<body className="font-sans antialiased bg-transparent overflow-clip scrollbar-none">
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
					<Toaster />
					<div className="h-screen overflow-clip">
						<TooltipProvider>
							<Menu />
							<div
								className={cn(
									"h-screen overflow-auto border-t bg-background pb-8",
									// "scrollbar-none"
									"scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md"
								)}
							>
								<SessionProvider>{children}</SessionProvider>
							</div>
						</TooltipProvider>
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
