package me.blockfluit.webstats.listeners;

import me.blockfluit.webstats.stats.PlayerManager;
import me.blockfluit.webstats.stats.Types;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.block.BlockBreakEvent;

public class BlockBreakListener implements Listener {
    private final PlayerManager playerManager;

    public BlockBreakListener(PlayerManager playerManager) {
        this.playerManager = playerManager;
    }

    @EventHandler
    public void onBlockBreak(BlockBreakEvent event) {
        playerManager.getPlayer(event.getPlayer().getUniqueId())
            .get()
            .addStatistic(
            Types.MINED,
            event.getBlock().getType().getKey(),
            1);
    }
}
