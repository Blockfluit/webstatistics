package me.blockfluit.webstats.stats;

import com.google.gson.JsonObject;
import me.blockfluit.webstats.util.JsonFileReader;
import org.bukkit.Bukkit;
import org.bukkit.OfflinePlayer;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.FileNotFoundException;
import java.util.*;

public class PlayerManager {
    private final JavaPlugin javaPlugin;
    private final List<Player> players;

    public PlayerManager(JavaPlugin javaPlugin)  {
        this.javaPlugin = javaPlugin;
        players = new ArrayList<>();

        Arrays.asList(Bukkit.getOfflinePlayers())
                .forEach(this::addPlayer);
    }

    public void addPlayer(OfflinePlayer offlinePlayer) {
        try {
            players.add(new Player(offlinePlayer.getUniqueId(),
                    offlinePlayer.getName(),
                    JsonFileReader.getJsonFileWithUUID(offlinePlayer.getUniqueId())));
        } catch (FileNotFoundException e) {
           javaPlugin.getLogger().warning(e.getMessage());
        }
    }

    public void addPlayer(org.bukkit.entity.Player player) {
        JsonObject stats = new JsonObject();
        stats.add("stats", new JsonObject());

        players.add(new Player(player.getUniqueId(),
                player.getName(),
                stats));
    }

    public Optional<Player> getPlayer(String name) {
        return players.stream()
                .filter(p -> p.getName().equals(name))
                .findFirst();
    }

    public Optional<Player> getPlayer(UUID uuid) {
        return players.stream()
                .filter(p -> p.getUuid().equals(uuid))
                .findFirst();
    }

    public List<Player> getPlayers() {
        return players;
    }
}
