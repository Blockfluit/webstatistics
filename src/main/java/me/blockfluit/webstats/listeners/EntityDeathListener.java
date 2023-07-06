package me.blockfluit.webstats.listeners;

import me.blockfluit.webstats.stats.PlayerManager;
import me.blockfluit.webstats.stats.Types;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.EntityDeathEvent;

public class EntityDeathListener implements Listener {
    private final PlayerManager playerManager;

    public EntityDeathListener(PlayerManager playerManager) {
        this.playerManager = playerManager;
    }

    @EventHandler
    public void onEntityDeathListener(EntityDeathEvent event) {
        if(event.getEntity().getKiller() != null) {
            playerManager.getPlayer(event.getEntity().getKiller().getUniqueId())
                .get().addStatistic(
                Types.KILLED,
                event.getEntityType().getKey(),
                1
            );
        }
    }
}
