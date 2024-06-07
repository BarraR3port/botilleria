import { jwtConfig } from "@/auth/utils";
import { ResetForm } from "@/forms/auth/ResetForm";
import prisma from "@/lib/prismadb";
import axios from "axios";
import { jwtVerify } from "jose";
import { RedirectType, redirect } from "next/navigation";

export default async function ResetPassword({
	searchParams
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	if (typeof searchParams.token !== "string") {
		redirect("/signIn", RedirectType.replace);
	}

	const response = await axios.get(`/api/auth/reset?token=${searchParams.token}`);
	const recovery = await prisma.recovery.findUnique({
		where: {
			token: searchParams.token as string,
			status: "WAITING"
		}
	});

	if (!recovery) {
		redirect("/signIn", RedirectType.replace);
	}

	let email = "";
	try {
		const decoded = await jwtVerify(recovery.token, jwtConfig.reset);
		email = decoded.payload?.email as string;
	} catch (error) {
		console.warn("Error decoding token", error);
		redirect("/signIn", RedirectType.replace);
	}

	return (
		<div className="flex justify-center">
			<div className="w-full max-w-[400px] px-4 space-y-6 ">
				<div className="w-32 h-32 mx-auto ">
					{/* <Image src="/pary-white-512.webp" alt="Pary Studio" width={128} height={128} /> */}
				</div>
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Actualizar tu contraseña</h1>
				</div>
				<ResetForm email={email} recovery={recovery} />
			</div>
		</div>
	);
}
