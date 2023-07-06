package me.blockfluit.webstats.listeners;

import me.blockfluit.webstats.stats.PlayerManager;
import me.blockfluit.webstats.stats.Types;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.inventory.CraftItemEvent;

public class CraftItemListener implements Listener {
    private final PlayerManager playerManager;

    public CraftItemListener(PlayerManager playerManager) {
        this.playerManager = playerManager;
    }

    @EventHandler
    public void onCraftItem(CraftItemEvent event) {
        playerManager.getPlayer(event.getWhoClicked().getUniqueId())
            .get().addStatistic(
            Types.CRAFTED,
            event.getCurrentItem().getType().getKey(),
            event.getCurrentItem().getAmount()
        );
    }
}
