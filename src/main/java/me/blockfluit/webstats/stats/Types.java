package me.blockfluit.webstats.stats;

public enum Types {
    BROKEN("minecraft:broken"),
    MINED("minecraft:mined"),
    DROPPED("minecraft:dropped"),
    PICKED_UP("minecraft:picked_up"),
    CRAFTED("minecraft:crafted"),
    KILLED_BY("minecraft:killed_by"),
    KILLED("minecraft:killed"),
    CUSTOM("minecraft:custom"),
    USED("minecraft:used");

    private String type;

    Types(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
