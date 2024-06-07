import { RecoverForm } from "@/forms/auth/RecoverForm";

export default function Recover() {
	return (
		<div className="flex justify-center">
			<div className="w-full max-w-[400px] px-4 space-y-6 ">
				<div className="w-32 h-32 mx-auto ">
					{/* <Image src="/pary-white-512.webp" alt="Pary Studio" width={128} height={128} /> */}
				</div>
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Recuperar Tu cuenta</h1>
				</div>
				<RecoverForm />
			</div>
		</div>
	);
}
