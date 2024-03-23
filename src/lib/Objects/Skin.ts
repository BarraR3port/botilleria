import AlexMask64 from "@public/images/masks/alex_x64.png";
import AlexMask128 from "@public/images/masks/alex_x128.png";
import SteveMask64 from "@public/images/masks/steve_x64.png";
import SteveMask128 from "@public/images/masks/steve_x128.png";
import SteveSkin from "@public/images/steve_skin.png";
import type { ModelType } from "skinview-utils";

export interface Skin {
	file_name: string;
	name: string;
	file_path: string;
	url_blob_path: string;
	file: File;
	price: PriceType;
	model: CustomModelType;
}

export interface SkinToExport {
	localization_name: string;
	geometry: string;
	texture: string;
	type: PriceType;
}

export interface SkinJSON {
	skins: SkinToExport[];
	serialize_name: string;
	localization_name: string;
}

export type CustomModelType = ModelType | "auto-detect";
export type PriceType = "paid" | "free";
export type PackManifestType = "skin_pack" | "resources" | "data";

export interface SkinManifestJSON {
	format_version: number;
	header: SkinManifestHeader;
	modules: PackManifestModule[];
}

export interface SkinManifestHeader {
	name: string;
	version: number[];
	uuid: string;
}

export interface PackManifestModule {
	version: number[];
	type: PackManifestType;
	uuid: string;
}

let ALEX_SKIN_MASK_X64: HTMLImageElement;
let STEVE_SKIN_MASK_X64: HTMLImageElement;
let ALEX_SKIN_MASK_X128: HTMLImageElement;
let STEVE_SKIN_MASK_X128: HTMLImageElement;

export function loadMasks() {
	if (ALEX_SKIN_MASK_X64 && STEVE_SKIN_MASK_X64) return;
	ALEX_SKIN_MASK_X64 = document.createElement("img");
	ALEX_SKIN_MASK_X128 = document.createElement("img");
	STEVE_SKIN_MASK_X64 = document.createElement("img");
	STEVE_SKIN_MASK_X128 = document.createElement("img");
	ALEX_SKIN_MASK_X64.src = AlexMask64.src;
	ALEX_SKIN_MASK_X128.src = AlexMask128.src;
	STEVE_SKIN_MASK_X64.src = SteveMask64.src;
	STEVE_SKIN_MASK_X128.src = SteveMask128.src;
}

export function cleanUnusedPixels(image: HTMLImageElement, isSlim: boolean, is64: boolean): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	const mask = isSlim
		? is64
			? ALEX_SKIN_MASK_X64
			: ALEX_SKIN_MASK_X128
		: is64
		  ? STEVE_SKIN_MASK_X64
		  : STEVE_SKIN_MASK_X128;

	const context = canvas.getContext("2d");
	if (!context) throw new Error("Unable to get canvas context");
	context.drawImage(image, 0, 0);

	const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
	const pixels = imageData.data;

	const maskCanvas = document.createElement("canvas");
	maskCanvas.width = mask.width;
	maskCanvas.height = mask.height;

	const maskContext = maskCanvas.getContext("2d");
	if (!maskContext) throw new Error("Unable to get canvas context");
	maskContext.drawImage(mask, 0, 0);

	const maskData = maskContext.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
	const maskPixels = maskData.data;

	for (let i = 0; i < pixels.length; i += 4) {
		const pixelIsInMask = maskPixels[i + 3] > 0;

		if (!pixelIsInMask) {
			pixels[i + 3] = 0; // Set alpha channel to 0 (transparent)
		}
	}

	context.putImageData(imageData, 0, 0);

	return canvas;
}

export const STEVE_SKIN: Skin = {
	file_name: "steve.png",
	name: "",
	file: undefined as unknown as File,
	file_path: SteveSkin.src,
	url_blob_path: SteveSkin.src,
	price: "paid",
	model: "default",
};
Object.freeze(STEVE_SKIN);
