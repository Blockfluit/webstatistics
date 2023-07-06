package me.blockfluit.webstats.util;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.UUID;

public class JsonFileReader {
    private JsonFileReader() {}
    public static JsonObject getJsonFileWithUUID(UUID uuid) throws FileNotFoundException{
        return (JsonObject) JsonParser.parseReader(new FileReader(String.format("./world/stats/%s.json", uuid)));
    }
}
