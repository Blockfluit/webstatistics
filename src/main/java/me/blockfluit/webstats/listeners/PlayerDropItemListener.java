package me.blockfluit.webstats.listeners;

import me.blockfluit.webstats.stats.PlayerManager;
import me.blockfluit.webstats.stats.Types;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerDropItemEvent;

public class PlayerDropItemListener implements Listener {
    private final PlayerManager playerManager;

    public PlayerDropItemListener(PlayerManager playerManager) {
        this.playerManager = playerManager;
    }

    @EventHandler
    public void onPlayerDropItem(PlayerDropItemEvent event) {
        playerManager.getPlayer(event.getPlayer().getUniqueId())
            .get().addStatistic(
            Types.DROPPED,
            event.getItemDrop().getItemStack().getType().getKey(),
            event.getItemDrop().getItemStack().getAmount()
        );
    }
}
