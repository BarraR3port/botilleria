import type { SkinViewerOptions } from "skinview3d";
import type { StateCreator } from "zustand";
import { STEVE_SKIN, type Skin, type SkinToExport } from "../../lib/Objects/Skin";
import { formatLocalizationSkinName, formatSkinFilePath } from "../../lib/PackageUtils/PackageUtils";
import type { ApiSlice } from "../api/ApiSlice";
import type { AuthApiSlice } from "../api/AuthApiSlice";
import type { UserApiSlice } from "../api/UserApiSlice";
import type { ProjectArtSlice } from "./ProjectArtSlice";
import type { ProjectSlice } from "./ProjectSlice";
import type { SessionSlice } from "./SessionSlice";
import type { SettingsSlice } from "./SettingsSlice";
import type { UserSlice } from "./UserSlice";

export interface SkinSlice {
	skin: Skin;
	options: SkinViewerOptions;
	editingSkin: Skin | null;
	updateSkin: (newSkin: Skin) => void;
	setEditingSkin: (newSkin: Skin | null) => void;
	updateSkinFile: (currentSkin: Skin, deleteSkin?: boolean) => Promise<void>;
}

export const createSkinSlice: StateCreator<
	SessionSlice &
		UserSlice &
		ProjectArtSlice &
		SettingsSlice &
		SkinSlice &
		ProjectSlice &
		ApiSlice &
		UserApiSlice &
		AuthApiSlice,
	[],
	[],
	SkinSlice
> = (set, get) => ({
	skin: STEVE_SKIN,
	options: {
		model: "slim",
		pixelRatio: "match-device",
		background: "#17181C",
	},
	editingSkin: null,
	updateSkin: (newSkin: Skin) => {
		const { project, addError } = get();
		if (project === null || project.skinPack === null) return;

		set({
			skin: newSkin,
		});
		try {
			project.skinPack.skinList.forEach((localSkin, i) => {
				if (localSkin.url_blob_path === newSkin.url_blob_path && project.skinPack) {
					project.skinPack.skinList[i] = newSkin;
				}
			});

			project.skinPack?.skinList.forEach((localSkin, i) => {
				project.skinPack?.texts.forEach(text => {
					text.translations.forEach((traduction, k) => {
						if (i === k) {
							traduction.key = formatLocalizationSkinName(localSkin.name);
							traduction.value = localSkin.name.trim();
						}
					});
				});
			});
		} catch (err) {
			addError("Found New Error while changing the Skin: ", newSkin, " ERROR:", err);
		}

		set({
			project,
		});
	},
	setEditingSkin: (newSkin: Skin | null) => {
		set({ editingSkin: newSkin });
	},
	updateSkinFile: async (currentSkin: Skin, deleteSkin?: boolean) => {
		const { project, skin, updateSkin, saveAllData, getProjectNameFormatted } = get();
		if (!!false && project !== null) {
			const { appDataDir, join } = await import("@tauri-apps/api/path");
			const { BaseDirectory, removeFile, writeTextFile } = await import("@tauri-apps/api/fs");
			if (deleteSkin) {
				if (skin !== null && project?.skinPack !== null && project?.skinPack.skinList.length !== 0) {
					const newSkins = project?.skinPack.skinList.filter(skin => skin !== currentSkin);
					const skinPackNameFormatted = getProjectNameFormatted()
						?.split(/\s+/)
						.map((word, index) => {
							if (typeof word[0] !== "string") return "";
							if (index === 0) {
								return word.replace(/[^a-zA-Z0-9_\-.]/g, "");
							}
							return (
								word[0].toUpperCase() +
								word
									.slice(1)
									.toLowerCase()
									.replace(/[^a-zA-Z0-9_\-.]/g, "")
							);
						})
						.join("");
					const appDataDirPath = await appDataDir();
					await removeFile(currentSkin.file_path)
						.catch(() => {})
						.finally(async () => {
							const skinsToSave: SkinToExport[] = [];
							newSkins.forEach(skin => {
								skinsToSave.push({
									localization_name: formatLocalizationSkinName(skin.name),
									geometry: `geometry.humanoid.${skin.model === "default" ? "custom" : "customSlim"}`,
									texture: formatSkinFilePath(skin.name, skin.model),
									type: skin.price,
								});
							});
							URL.revokeObjectURL(currentSkin.url_blob_path);
							const { invoke } = await import("@tauri-apps/api/tauri");
							const projectUUID = await invoke("get_project_uuid", {}).then(async response => {
								if (typeof response === "string") {
									return response;
								}
								return "";
							});
							const defaultAppSkinPath = await join(
								appDataDirPath,
								"Projects",
								projectUUID,
								"out",
								"Content",
								"skin_pack",
							);
							const skinsJson = {
								skins: skinsToSave,
								serialize_name: skinPackNameFormatted,
								localization_name: skinPackNameFormatted,
							};
							const skinsAsJSON = JSON.stringify(skinsJson, null, 4);
							const finalSkinMetadata = await join(defaultAppSkinPath, "skins.json");

							project.skinPack?.texts.forEach(text => {
								text.translations.filter((traduction, i) => {
									if (traduction.key === currentSkin.name.replace(/[^a-zA-Z0-9_\-.]/g, "")) {
										text.translations.splice(i, 1);
									}
									return true;
								});
							});

							await writeTextFile(finalSkinMetadata, skinsAsJSON, {
								dir: BaseDirectory.AppData,
							})
								.catch(_err => {
									/* showNotification({
										title: err,
										message: "",
										color: "red",
										icon: <FontAwesomeIcon icon={faXmark} />,
										id: "skin-save-error",
									}) */
								})
								.finally(async () => {
									if (!project.skinPack) return;
									project.skinPack.skinList = newSkins;
									if (newSkins.length === 0) {
										project.skinPack.skinResolution = null;
									}

									updateSkin(
										currentSkin !== skin ? skin : newSkins.length === 0 ? STEVE_SKIN : newSkins[0],
									);

									saveAllData();
								});
						});
				} else {
					updateSkin({
						...skin,
						model: "default",
						name: "",
						price: "paid",
					});
					if (project.skinPack) {
						project.skinPack.skinResolution = null;
					}
				}
			}
		} else {
			// TODO: Create a Backend system to support this for the web version.
			/* showNotification({
                title: t("pack.errors.featureNotAvailable"),
                message: "",
                color: "red",
                icon: <FontAwesomeIcon icon={faXmark} />,
            }); */
		}
	},
});
