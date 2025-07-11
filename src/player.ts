import * as mc from "@minecraft/server";

/**
 * Checks if the player is in Creative or Spectator game mode.
 * @param player - The player to check.
 * @returns `true` if the player is in Creative or Spectator mode, otherwise `false`.
 */
export const isCreativeOrSpectator = (player: mc.Player): boolean => {
	if (!player.isValid) return false;
	const gameMode = player.getGameMode();
	return gameMode === mc.GameMode.Creative || gameMode === mc.GameMode.Spectator;
};

/**
 * Adds a camera shake effect to the specified player.
 * @param player The player to add the camera shake to.
 * @param intensity The intensity of the camera shake.
 * @param seconds The duration of the camera shake in seconds.
 * @param mode The mode of the camera shake. Can be "positional" or "rotational".
 */
export const addCameraShake = (
	player: mc.Player,
	intensity: number,
	seconds: number,
	mode: "positional" | "rotational",
): void => {
	player.runCommand(`camerashake add @s ${intensity} ${seconds} ${mode}`);
};

/**
 * Stops any active camera shake effect on the specified player.
 * @param player The player to stop the camera shake for.
 */
export const stopCameraShake = (player: mc.Player): void => {
	player.runCommand(`camerashake stop @s`);
};
