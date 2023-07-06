package me.blockfluit.webstats.stats;

public enum NewKeys {
    DROP_COUNT("minecraft:drop"),
    CHEST_OPENED("minecraft:open_chest"),
    FLOWER_POTTED("minecraft:pot_flower"),
    PLAY_ONE_MINUTE("minecraft:play_time"),
    RECORD_PLAYED("minecraft:play_record"),
    CHEST_OPEN("minecraft:open_chest"),
    ITEM_ENCHANTED("minecraft:enchant_item"),
    NOTEBLOCK_TUNED("minecraft:tune_noteblock"),
    NOTEBLOCK_PLAYED("minecraft:play_noteblock"),
    ENDERCHEST_OPENED("minecraft:open_enderchest"),
    FURNACE_INTERACTION("minecraft:interact_with_furnace"),
    TRAPPED_CHEST_TRIGGERED("minecraft:trigger_trapped_chest"),
    BREWINGSTAND_INTERACTION("minecraft:interact_with_brewingstand"),
    CRAFTING_TABLE_INTERACTION("minecraft:interact_with_crafting_table"),
    HOPPER_INSPECTED("minecraft:inspect_hopper"),
    DISPENSER_INSPECTED("minecraft:inspect_dispenser");


    private String key;

    NewKeys(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }
}
