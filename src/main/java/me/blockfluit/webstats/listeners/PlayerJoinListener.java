package me.blockfluit.webstats.listeners;

import me.blockfluit.webstats.stats.PlayerManager;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;

public class PlayerJoinListener implements Listener {
    PlayerManager playerManager;

    public PlayerJoinListener(PlayerManager playerManager) {
        this.playerManager = playerManager;
    }

    @EventHandler
    public void onPlayerJoin(PlayerJoinEvent event) {
        playerManager.getPlayer(event.getPlayer().getUniqueId())
                .ifPresentOrElse((value) -> {}, () -> playerManager.addPlayer(event.getPlayer()));
    }

}
