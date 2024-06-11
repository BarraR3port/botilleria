"use client";

import { usePathname } from "next/navigation";

import {
	MenubarContent,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarTrigger
} from "@/components/ui/menubar";

const examples = [
	{
		name: "Iniciar Sesión",
		href: "/signIn"
	},
	{
		name: "Recuperar Contraseña",
		href: "/recover"
	},
	{
		name: "Ventas",
		href: "/"
	}
];

interface ExamplesNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ExamplesNav({ className, ..._props }: ExamplesNavProps) {
	const pathname = usePathname();

	return (
		<MenubarMenu>
			<MenubarTrigger>
				<span className="rounded-md bg-cyan-500 px-1.5 py-0.5 text-xs font-medium leading-none text-[#000000] no-underline group-hover:no-underline">
					nav
				</span>
				{pathname}
			</MenubarTrigger>
			<MenubarContent forceMount>
				<MenubarRadioGroup value={pathname}>
					{examples.map(example => (
						<a href={example.href} key={example.name}>
							<MenubarRadioItem value={example.href}>{example.name}</MenubarRadioItem>
						</a>
					))}
				</MenubarRadioGroup>
			</MenubarContent>
		</MenubarMenu>
	);
}
