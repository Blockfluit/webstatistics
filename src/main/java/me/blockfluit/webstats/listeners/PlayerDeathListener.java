package me.blockfluit.webstats.listeners;

import me.blockfluit.webstats.stats.PlayerManager;
import me.blockfluit.webstats.stats.Types;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.PlayerDeathEvent;

public class PlayerDeathListener implements Listener {
    private final PlayerManager playerManager;

    public PlayerDeathListener(PlayerManager playerManager) {
        this.playerManager = playerManager;
    }

    @EventHandler
    public void onPlayerDeathListener(PlayerDeathEvent event) {
        playerManager.getPlayer(event.getEntity().getUniqueId())
            .get().addStatistic(
            Types.KILLED_BY,
            event.getEntityType().getKey(),
            1
        );
    }
}
