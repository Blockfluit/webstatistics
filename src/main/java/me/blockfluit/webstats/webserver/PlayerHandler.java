package me.blockfluit.webstats.webserver;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import me.blockfluit.webstats.WebStats;
import me.blockfluit.webstats.exceptions.PlayerNotFoundException;
import me.blockfluit.webstats.stats.Player;
import me.blockfluit.webstats.stats.PlayerJsonMapper;
import me.blockfluit.webstats.stats.PlayerManager;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

public class PlayerHandler implements HttpHandler {
    private final WebStats webStats;
    private final PlayerManager playerManager;

    public PlayerHandler(WebStats webStats) {
        this.webStats = webStats;
        this.playerManager = webStats.getPlayerManager();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        final String domain = webStats.getConfig().getString("domain");
        final String path = exchange.getRequestURI().toASCIIString();
        byte[] bytes = {};
        OutputStream os = exchange.getResponseBody();

        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods","GET");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers","content-type");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", domain);

        try {
            if(path.equals("/user?name=")) {
                List<Player> players = playerManager.getPlayers();
                bytes = PlayerJsonMapper.toJson(players)
                        .toString().getBytes();
            } else {
                Player player = playerManager.getPlayer(path.replace("/user?name=", ""))
                        .orElseThrow(() -> new PlayerNotFoundException("The player you are looking for does not exist"));
                bytes = PlayerJsonMapper.toJson(player).toString().getBytes();
            }

            exchange.sendResponseHeaders(200, bytes.length);
        } catch (PlayerNotFoundException e) {
            bytes = e.getMessage().getBytes();
            exchange.sendResponseHeaders(404, bytes.length);
        } catch (Exception e) {
            bytes = "Something internally went wrong".getBytes();
            exchange.sendResponseHeaders(500, bytes.length);
        } finally {
            os.write(bytes);
            exchange.close();
        }
    }
}

