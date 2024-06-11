"use client";

import { Beer, ExternalLink, Info, X } from "lucide-react";
import { useCallback } from "react";
import { WindowTitlebar } from "tauri-controls";

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

import { AboutDialog } from "./about-dialog";
import { Dialog, DialogTrigger } from "./ui/dialog";

export function Menu() {
	const closeWindow = useCallback(async () => {
		const { getCurrent } = await import("@tauri-apps/api/window");
		const { confirm } = await import("@tauri-apps/plugin-dialog");
		await confirm("¿Estás seguro que quieres cerrar la app?", {
			title: "Botillería",
			okLabel: "cerrar",
			cancelLabel: "cancelar"
		}).then((ok: any) => {
			if (ok) {
				getCurrent().close();
			}
		});
	}, []);

	const openExternalLink = useCallback(async (url: string) => {
		const { open } = await import("@tauri-apps/plugin-shell");
		open(url);
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
					<MenubarTrigger className="font-bold hover:cursor-pointer">Botillería</MenubarTrigger>
					<Dialog modal={false}>
						<MenubarContent>
							<DialogTrigger asChild>
								<MenubarItem className="hover:cursor-pointer">
									<Info className="w-4 h-4 mr-2" />
									Sobre la app
								</MenubarItem>
							</DialogTrigger>
							<MenubarItem
								className="hover:cursor-pointer"
								onClick={() => openExternalLink(`${process.env.API_URL}/panel`)}
							>
								<ExternalLink className="w-4 h-4 mr-2" />
								Panel de Administración
							</MenubarItem>
							<MenubarItem className="hover:cursor-pointer" onClick={closeWindow}>
								<X className="w-4 h-4 mr-2" />
								Salir
							</MenubarItem>
						</MenubarContent>

						<AboutDialog />
					</Dialog>
				</MenubarMenu>
			</Menubar>
		</WindowTitlebar>
	);
}
