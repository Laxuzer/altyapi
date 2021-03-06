class Command {

    /**
     * @param {{run: (ctx: import("./Ctx")) => Promise<void> | void, name: string, aliases?: string[], category?: string, description?: string, usage?: string[], enabled: boolean, nsfw?: boolean, cooldown?: Number, permissions?: { developerOnly?: Boolean, moderatorRole: Boolean, ownerOnly?: Boolean, member?: { channel?: import("discord.js").PermissionString[], guild?: import("discord.js").PermissionString[] }, bot?: { channel?: import("discord.js").PermissionString[], guild?: import("discord.js").PermissionString[] } }, subCommands?: [{run: (ctx: import("./Context")) => Promise<void> | void, rawName: string, name?: string, aliases?: string[], description?: string, usage?: string[]}], settings?: {[key: any]}}} param0
     */
    constructor({
        name = "empty",
        aliases = [],
        category = "Other",
        description = "No desc.",
        usage = [],
        enabled = true,
        nsfw = false,
        cooldown = 5,
        permissions = {
            developerOnly: false,
            ownerOnly: false,
            moderatorRole: false,
            member: { channel: [], guild: [] }, 
            bot: { channel: [], guild: [] }
        },
        subCommands = [],
        settings = {},
        run
    }) {
        this.name = name;
        this.aliases = aliases;
        this.category = category;
        this.description = description;
        this.usage = usage;
        this.enabled = enabled;
        this.nsfw = nsfw;
        this.cooldown = cooldown;
        this.permissions = permissions;
        this.subCommands = subCommands;
        this.settings = settings;
        this.run = run;
    }
}

module.exports = Command;
