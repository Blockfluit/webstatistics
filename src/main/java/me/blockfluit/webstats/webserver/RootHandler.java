package me.blockfluit.webstats.webserver;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import me.blockfluit.webstats.WebStats;
import org.apache.tika.Tika;

import java.io.*;
import java.util.Objects;

public class RootHandler implements HttpHandler {
    private final WebStats webStats;
    private final ClassLoader classLoader = getClass().getClassLoader();
    private final Tika tika;

    public RootHandler(WebStats webStats) {
        this.webStats = webStats;
        tika = new Tika();
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        final String domain = webStats.getConfig().getString("domain");
        byte[] bytes;
        String path;

        if(exchange.getRequestURI().getPath().equals("/")) {
            path = "/html/index.html";
        } else if(exchange.getRequestURI().getPath().contains(".html")) {
            path = "/html" + exchange.getRequestURI().getPath();
        } else {
            path = exchange.getRequestURI().getPath();
        }

        OutputStream os = exchange.getResponseBody();
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods","GET");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", domain);
        try {
            InputStream is = Objects.requireNonNull(classLoader.getResourceAsStream("web" + path));
            bytes = is.readAllBytes();
            exchange.getResponseHeaders().set("Content-Type", tika.detect(path));
            exchange.sendResponseHeaders(200, bytes.length);
            os.write(bytes);
        } catch (NullPointerException e) {
            bytes = "The file you are looking for does not exist".getBytes();
            exchange.sendResponseHeaders(404, bytes.length);
            os.write(bytes);
        } catch (Exception e) {
            bytes = "Something internally went wrong".getBytes();
            exchange.sendResponseHeaders(500, bytes.length);
        } finally {
           exchange.close();
        }
    }
}
