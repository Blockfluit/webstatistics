package me.blockfluit.webstats.listeners;

import me.blockfluit.webstats.stats.PlayerManager;
import me.blockfluit.webstats.stats.Types;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerPickupItemEvent;

public class PlayerPickupItemListener implements Listener {
    private final PlayerManager playerManager;

    public PlayerPickupItemListener(PlayerManager playerManager) {
        this.playerManager = playerManager;
    }

    @EventHandler
    public void onPlayerPickupItem(PlayerPickupItemEvent event) {
        playerManager.getPlayer(event.getPlayer().getUniqueId())
            .get().addStatistic(
            Types.PICKED_UP,
            event.getItem().getItemStack().getType().getKey(),
            event.getItem().getItemStack().getAmount()
        );
    }
}
