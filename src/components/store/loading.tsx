export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center h-screen gap-4">
			<div className="w-12 h-12 border-4 border-gray-900 rounded-full animate-spin border-t-transparent dark:border-gray-50 dark:border-t-transparent" />
			<p className="text-gray-500 dark:text-gray-400">Espera un momento...</p>
		</div>
	);
}
