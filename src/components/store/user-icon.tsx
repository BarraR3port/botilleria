"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/contexts/SessionContext";
import { useAppStore } from "@/store/AppStore";
import { ExternalLink, Home, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

type UserIconProps = {
	navBar?: boolean;
};

export function UserIcon({ navBar }: UserIconProps) {
	const { logOut, session } = useAppStore();
	const router = useRouter();
	const pathName = usePathname();

	const signOutHandler = () => {
		logOut();
		router.refresh();
	};

	const openExternalLink = useCallback(async (url: string) => {
		const { open } = await import("@tauri-apps/plugin-shell");
		open(url);
	}, []);

	if (!session?.user) {
		return (
			<div className="flex space-x-2 ">
				{pathName !== "/signIn" && (
					<Link href={"/signIn"} className={buttonVariants({ size: "sm" })}>
						<span>Iniciar Sesión</span>
					</Link>
				)}
			</div>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex self-center flex-auto gap-2 font-medium ">
					<Button variant="ghost" className="relative rounded-full w-9 h-9">
						<Avatar className="w-9 h-9">
							<AvatarFallback>
								{session?.user.name?.[0]?.toUpperCase()}
								{session?.user.lastName?.[0]?.toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</Button>
					{navBar && (
						<div className="flex flex-col space-y-1">
							<p className="flex text-sm font-medium leading-none">
								{session?.user?.name} {session?.user?.lastName}
							</p>
							<p className="text-xs leading-none text-muted-foreground md:flex">{session?.user?.email}</p>
						</div>
					)}
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-50" align="end" forceMount>
				{!navBar && (
					<>
						<DropdownMenuLabel className="font-normal ">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium leading-none xs:flex">
									{session?.user?.name} {session?.user?.lastName}
								</p>
								<p className="text-xs leading-none text-muted-foreground md:flex">
									{session?.user?.email}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
					</>
				)}
				<DropdownMenuGroup>
					<DropdownMenuItem
						className="hover:cursor-pointer"
						onClick={() => openExternalLink(`${process.env.NEXT_PUBLIC_API_URL}/panel`)}
					>
						Panel
						<DropdownMenuShortcut>
							<ExternalLink size={16} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="hover:cursor-pointer" onClick={signOutHandler}>
					Salir
					<DropdownMenuShortcut>
						<LogOut size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
