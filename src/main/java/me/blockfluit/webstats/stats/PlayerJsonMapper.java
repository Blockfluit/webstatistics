package me.blockfluit.webstats.stats;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.List;

public class PlayerJsonMapper {

    private PlayerJsonMapper() {}

    public static JsonObject toJson(Player player) {
        JsonObject jsonObject = new JsonObject();

        jsonObject.addProperty("uuid", player.getUuid().toString());
        jsonObject.addProperty("name", player.getName());
        jsonObject.add("stats", player.getStatistics().getAsJsonObject("stats"));
        jsonObject.add("info", player.getInfo());

        return jsonObject;
    }

    public static JsonArray toJson(List<Player> players) {
        JsonArray jsonArray = new JsonArray();

        players.forEach(player -> jsonArray.add(toJson(player)));

        return jsonArray;
    }
}
