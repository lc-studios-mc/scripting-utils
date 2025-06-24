import * as mc from "@minecraft/server";

/**
 * Checks if the player is in Creative or Spectator game mode.
 * @param player - The player to check.
 * @returns `true` if the player is in Creative or Spectator mode, otherwise `false`.
 */
export function isCreativeOrSpectator(player: mc.Player): boolean {
	if (!player.isValid) return false;
	const gameMode = player.getGameMode();
	return gameMode === mc.GameMode.Creative || gameMode === mc.GameMode.Spectator;
}
