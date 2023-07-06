package me.blockfluit.webstats;

import me.blockfluit.webstats.listeners.*;
import me.blockfluit.webstats.stats.PlayerManager;
import me.blockfluit.webstats.webserver.WebServer;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.IOException;

public final class WebStats extends JavaPlugin {
    private final PlayerManager playerManager;

    public WebStats() {
        playerManager = new PlayerManager(this);
    }

    public PlayerManager getPlayerManager() {
        return playerManager;
    }

    @Override
    public void onEnable() {
        final FileConfiguration config = this.getConfig();
        final WebServer webServer = new WebServer(this);

        config.addDefault("address", "127.0.0.1");
        config.addDefault("port", 8234);
        config.addDefault("domain", "http://127.0.0.1:8234");
        config.options().copyDefaults(true);
        saveConfig();

        getServer().getPluginManager().registerEvents(new PlayerPickupItemListener(playerManager), this);
        getServer().getPluginManager().registerEvents(new PlayerDropItemListener(playerManager), this);
        getServer().getPluginManager().registerEvents(new PlayerItemConsumeListener(playerManager), this);
        getServer().getPluginManager().registerEvents(new PlayerItemBreakListener(playerManager), this);
        getServer().getPluginManager().registerEvents(new CraftItemListener(playerManager), this);
        getServer().getPluginManager().registerEvents(new BlockBreakListener(playerManager), this);
        getServer().getPluginManager().registerEvents(new EntityDeathListener(playerManager), this);
        getServer().getPluginManager().registerEvents(new PlayerDeathListener(playerManager), this);
        getServer().getPluginManager().registerEvents(new PlayerJoinListener(playerManager), this);

        try {
            webServer.start();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void onDisable() {
        // Plugin shutdown logic
    }
}
