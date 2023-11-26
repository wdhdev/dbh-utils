import Event from "../../classes/Event";
import ExtendedClient from "../../classes/ExtendedClient";

import globalCommands from "../../scripts/global-commands";

const event: Event = {
    name: "ready",
    once: true,
    async execute(client: ExtendedClient) {
        try {
            // Login Message
            console.log(`Logged in as: ${client.user.tag.endsWith("#0") ? client.user.username : client.user.tag}`);

            // Register Commands
            await globalCommands(client);

            // Automatic Git Pull
            setInterval(() => {
                exec("git pull", (err: any, stdout: any) => {
                    if(err) return console.log(err);
                    if(stdout.includes("Already up to date.")) return;

                    console.log(stdout);
                    process.exit();
                })
            }, 30 * 1000) // 30 seconds
        } catch(err) {
            client.logError(err);
        }
    }
}

export = event;
