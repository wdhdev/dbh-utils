import { ColorResolvable, Snowflake } from "discord.js";

const embeds = {
    default: "#628FE3" as ColorResolvable,
    error: "#E74C3C" as ColorResolvable
}

const emojis = {
    connection_bad: "",
    connection_excellent: "",
    connection_good: "",
    cross: "",
    ping: "",
    reply: "",
    tick: ""
}

const main = {
    corePanel: "",
    developerPanel: "",
    owner: "" as Snowflake,
    privatePanel: "",
    publicPanel: ""
}

export {
    embeds,
    emojis,
    main
}

export default {
    embeds,
    emojis,
    main
}
