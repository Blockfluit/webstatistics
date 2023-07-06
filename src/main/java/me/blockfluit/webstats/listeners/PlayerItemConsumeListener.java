package me.blockfluit.webstats.listeners;

import me.blockfluit.webstats.stats.PlayerManager;
import me.blockfluit.webstats.stats.Types;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerItemConsumeEvent;

public class PlayerItemConsumeListener implements Listener {
    private final PlayerManager playerManager;

    public PlayerItemConsumeListener(PlayerManager playerManager) {
        this.playerManager = playerManager;
    }

    @EventHandler
    public void onPlayerItemConsume(PlayerItemConsumeEvent event) {
        playerManager.getPlayer(event.getPlayer().getUniqueId())
            .get().addStatistic(
            Types.USED,
            event.getItem().getType().getKey(),
            event.getItem().getAmount()
        );
    }
}
