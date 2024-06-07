import confetti from "canvas-confetti";

interface ConfettiOptions extends confetti.Options {
	particleCount?: number;
	angle?: number;
	spread?: number;
	startVelocity?: number;
	decay?: number;
	gravity?: number;
	drift?: number;
	flat?: boolean;
	ticks?: number;
	origin?: { x: number; y: number };
	colors?: string[];
	shapes?: confetti.Shape[];
	zIndex?: number;
	disableForReducedMotion?: boolean;
	useWorker?: boolean;
	resize?: boolean;
	canvas?: HTMLCanvasElement | null;
	scalar?: number;
}

const Confetti = (options: ConfettiOptions) => {
	if (options.disableForReducedMotion && window.matchMedia("(prefers-reduced-motion)").matches) {
		return;
	}

	const confettiInstance = options.canvas
		? confetti.create(options.canvas, {
				resize: options.resize ?? true,
				useWorker: options.useWorker ?? true
			})
		: confetti;

	confettiInstance({
		...options
	});
};

Confetti.shapeFromPath = (options: { path: string; [key: string]: any }) => {
	return confetti.shapeFromPath({ ...options });
};

Confetti.shapeFromText = (options: { text: string; [key: string]: any }) => {
	return confetti.shapeFromText({ ...options });
};

export { Confetti };

export const triggerFireworks = () => {
	const duration = 1 * 1000;
	const animationEnd = Date.now() + duration;
	const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

	const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

	const interval = window.setInterval(() => {
		const timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		const particleCount = 50 * (timeLeft / duration);
		Confetti({
			...defaults,
			particleCount,
			origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
		});
		Confetti({
			...defaults,
			particleCount,
			origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
		});
	}, 250);
};
