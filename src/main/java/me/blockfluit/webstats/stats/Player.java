package me.blockfluit.webstats.stats;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import org.bukkit.Bukkit;
import org.bukkit.NamespacedKey;
import org.bukkit.Statistic;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.Damageable;

import java.util.*;

public class Player {
    private final UUID uuid;
    private final String name;
    private final JsonObject statistics;

    public Player(UUID uuid, String name, JsonObject statistics) {
        this.uuid = uuid;
        this.name = name;
        this.statistics = statistics;
    }

    public UUID getUuid() {
        return uuid;
    }

    public String getName() {
        return name;
    }

    public JsonObject getStatistics() {
        updateCustomStatistics();
        return statistics;
    }

    public JsonObject getInfo() {
        boolean online = Bukkit.getPlayer(uuid) != null;
        JsonObject info = new JsonObject();
        info.addProperty("lastSeen", Bukkit.getOfflinePlayer(uuid).getLastPlayed());
        info.addProperty("startedPlaying", Bukkit.getOfflinePlayer(uuid).getFirstPlayed());
        info.addProperty("isOp",Bukkit.getOfflinePlayer(uuid).isOp());
        info.addProperty("online", online);

        if(!online) return info;

        JsonObject armour = new JsonObject();
        ItemStack[] items = Bukkit.getPlayer(uuid).getEquipment().getArmorContents();
        for (int i = 0; i < items.length; i++) {
            if(items[i] != null) {
                armour.add(items[i].getType().getKey().toString(), getItemInfo(items[i]));
            } else {
                String item = switch (i) {
                    case 0 -> "minecraft:empty_armor_slot_boots";
                    case 1 -> "minecraft:empty_armor_slot_leggings";
                    case 2 -> "minecraft:empty_armor_slot_chestplate";
                    case 3 -> "minecraft:empty_armor_slot_helmet";
                    default -> "minecraft:air";
                };
                armour.add(item, new JsonObject());
            }
        }
        JsonObject inventory = new JsonObject();

        ItemStack mainHand = Bukkit.getPlayer(uuid).getInventory().getItemInMainHand();
        JsonObject itemMainHand = new JsonObject();
        itemMainHand.add(mainHand.getType().getKey().toString(), getItemInfo(mainHand));
        inventory.add("mainHand", itemMainHand);

        ItemStack offHand = Bukkit.getPlayer(uuid).getInventory().getItemInOffHand();
        JsonObject itemOffHand = new JsonObject();
        itemOffHand.add(offHand.getType().getKey().toString(), getItemInfo(offHand));
        inventory.add("offHand", itemOffHand);


        inventory.add("armour", armour);
        info.addProperty("online", online);
        info.add("inventory", inventory);
        info.addProperty("health", Bukkit.getPlayer(uuid).getHealth());
        info.addProperty("level", Bukkit.getPlayer(uuid).getLevel());
        info.addProperty("foodLevel", Bukkit.getPlayer(uuid).getFoodLevel());

        return info;
    }

    public void addStatistic(Types type, NamespacedKey key, int addAmount) {
        if(addAmount == 0) return;
        if(key.toString() == null) return; // Condition is not always false
        JsonElement stat = statistics
                .getAsJsonObject("stats")
                .getAsJsonObject(type.getType()) == null ?
                null :
                statistics
                    .getAsJsonObject("stats")
                    .getAsJsonObject(type.getType())
                    .get(key.toString());

        int totalAmount = stat == null ? addAmount : stat.getAsInt() + addAmount;

        if(statistics.getAsJsonObject("stats").getAsJsonObject(type.getType()) == null) {
            JsonObject item = new JsonObject();
            item.addProperty(key.toString(), totalAmount);
            statistics
                    .getAsJsonObject("stats").add(type.getType(), item);
        } else {
            statistics
                    .getAsJsonObject("stats")
                    .getAsJsonObject(type.getType())
                    .addProperty(key.toString(), totalAmount);
        }
    }

    public void changeStatistic(Types type, NamespacedKey key, int amount) {
        if(statistics.getAsJsonObject("stats").getAsJsonObject(type.getType()) == null) {
            JsonObject item = new JsonObject();
            item.addProperty(key.toString(), amount);
            statistics
                    .getAsJsonObject("stats").add(type.getType(), item);
        } else {
            statistics
                    .getAsJsonObject("stats")
                    .getAsJsonObject(type.getType())
                    .addProperty(key.toString(), amount);
        }
    }

    private JsonObject getItemInfo(ItemStack item) {
        JsonObject itemInfo = new JsonObject();

        JsonObject enchantments = new JsonObject();
        item.getEnchantments()
                .forEach((enchantment, integer) -> enchantments.addProperty(enchantment.getKey().toString(), integer));
        itemInfo.add("enchantments", enchantments);

        if(item.getItemMeta() instanceof Damageable damageable) {
            itemInfo.addProperty("damage", damageable.getDamage());
            itemInfo.addProperty("maxDurability", item.getType().getMaxDurability());
        }

        return itemInfo;
    }

    private void updateCustomStatistics() {
        List<Statistic> ignore = Arrays.asList(Statistic.BREAK_ITEM,
                Statistic.USE_ITEM,
                Statistic.CRAFT_ITEM,
                Statistic.DROP,
                Statistic.PICKUP,
                Statistic.MINE_BLOCK,
                Statistic.KILL_ENTITY,
                Statistic.ENTITY_KILLED_BY);

        Arrays.asList(Statistic.values())
                .forEach(statistic -> {
                    if(!ignore.contains(statistic)) {
                        NamespacedKey key = statistic.getKey();

                        for (NewKeys newKey: NewKeys.values()) {
                            if(newKey.toString().equals(statistic.toString())) key = NamespacedKey.fromString(newKey.getKey());
                        }

                        changeStatistic(
                            Types.CUSTOM,
                            key,
                            Bukkit.getOfflinePlayer(uuid).getStatistic(statistic));
                    }
                });
    }
}
