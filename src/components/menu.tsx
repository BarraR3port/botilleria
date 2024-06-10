"use client";

import logo from "@/assets/logo.png";
import { Beer, Globe, Mic, Sailboat } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { WindowControls, WindowTitlebar } from "tauri-controls";

import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger
} from "@/components/ui/menubar";

import { AboutDialog } from "./about-dialog";
import { ExamplesNav } from "./examples-nav";
import { MenuModeToggle } from "./menu-mode-toggle";
import { Dialog, DialogTrigger } from "./ui/dialog";

export function Menu() {
	const closeWindow = useCallback(async () => {
		const { getCurrent } = await import("@tauri-apps/api/window");
		getCurrent().close();
	}, []);

	return (
		<WindowTitlebar
			// controlsOrder="left"
			className="pl-0"
			//windowControlsProps={{ platform: "windows", justify: false }}
		>
			<Menubar className="pl-2 border-b border-none rounded-none lg:pl-3">
				<MenubarMenu>
					<div className="inline-flex items-center h-fit w-fit text-cyan-500">
						<Beer className="w-5 h-5" />
					</div>
				</MenubarMenu>

				<MenubarMenu>
					<MenubarTrigger className="font-bold">App</MenubarTrigger>
					<Dialog modal={false}>
						<MenubarContent>
							<DialogTrigger asChild>
								<MenubarItem>Sobre la app</MenubarItem>
							</DialogTrigger>
							<MenubarItem onClick={closeWindow}>
								Salir <MenubarShortcut>⌘Q</MenubarShortcut>
							</MenubarItem>
						</MenubarContent>

						<AboutDialog />
					</Dialog>
				</MenubarMenu>

				<ExamplesNav />
			</Menubar>
		</WindowTitlebar>
	);
}
