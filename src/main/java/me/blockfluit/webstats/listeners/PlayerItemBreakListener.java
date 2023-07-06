package me.blockfluit.webstats.listeners;

import me.blockfluit.webstats.stats.PlayerManager;
import me.blockfluit.webstats.stats.Types;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerItemBreakEvent;

public class PlayerItemBreakListener implements Listener {
    private final PlayerManager playerManager;

    public PlayerItemBreakListener(PlayerManager playerManager) {
        this.playerManager = playerManager;
    }

    @EventHandler
    public void onPlayerItemBreak(PlayerItemBreakEvent event) {
        playerManager.getPlayer(event.getPlayer().getUniqueId())
            .get().addStatistic(
            Types.BROKEN,
            event.getBrokenItem().getType().getKey(),
            event.getBrokenItem().getAmount()
        );
    }
}
