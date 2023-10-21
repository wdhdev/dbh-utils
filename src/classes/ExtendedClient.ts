import { Client, Collection, Snowflake } from "discord.js";
import * as Sentry from "@sentry/node";

import Command from "./Command";
import Event from "./Event";

import { embeds, main } from "../config";

export default class ExtendedClient extends Client {
    public buttons: Collection<string, any>;
    public commandIds: Collection<string, Snowflake>;
    public commands: Collection<string, Command>;
    public config_embeds: typeof embeds;
    public config_main: typeof main;
    public events: Collection<string, Event>;
    public logCommandError: Function;
    public logError: Function;
    public logLegacyError: Function;
    public sentry: typeof Sentry;
    public validPermissions: string[];
}
