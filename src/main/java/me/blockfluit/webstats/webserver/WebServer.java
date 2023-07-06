package me.blockfluit.webstats.webserver;

import com.sun.net.httpserver.HttpServer;
import me.blockfluit.webstats.WebStats;

import java.io.IOException;
import java.net.InetSocketAddress;

public class WebServer {
    WebStats webStats;

    public WebServer(WebStats webStats) {
        this.webStats =  webStats;
    }

    public void start() throws IOException {
        String address = webStats.getConfig().getString("address");
        int port = webStats.getConfig().getInt("port");

        webStats.getLogger().info("Starting webserver...");
        HttpServer httpServer = HttpServer.create(
                new InetSocketAddress(address, port), 0);

        RootHandler rootHandler = new RootHandler(webStats);
        PlayerHandler playerHandler = new PlayerHandler(webStats);

        httpServer.createContext("/", rootHandler);
        httpServer.createContext("/user", playerHandler);
        httpServer.start();
        webStats.getLogger().info("Webserver started");
    }
}
