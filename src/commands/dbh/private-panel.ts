import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";

import axios from "axios";
import { emojis as emoji, main } from "../../config";

import API from "../../models/API";

const command: Command = {
    name: "private-panel",
    description: "Manage a DBH private panel server.",
    options: [
        {
            type: 1,
            name: "kill",
            description: "Kill a DBH private panel server.",
            options: [
                {
                    type: 3,
                    name: "server",
                    description: "The server to kill.",
                    required: true,
                    autocomplete: true
                }
            ]
        },

        {
            type: 1,
            name: "restart",
            description: "Restart a DBH private panel server.",
            options: [
                {
                    type: 3,
                    name: "server",
                    description: "The server to restart.",
                    required: true,
                    autocomplete: true
                }
            ]
        },

        {
            type: 1,
            name: "start",
            description: "Start a DBH private panel server.",
            options: [
                {
                    type: 3,
                    name: "server",
                    description: "The server to start.",
                    required: true,
                    autocomplete: true
                }
            ]
        },

        {
            type: 1,
            name: "stop",
            description: "Stop a DBH private panel server.",
            options: [
                {
                    type: 3,
                    name: "server",
                    description: "The server to stop.",
                    required: true,
                    autocomplete: true
                }
            ]
        }
    ],
    default_member_permissions: null,
    botPermissions: [],
    cooldown: 5,
    enabled: true,
    ownerOnly: false,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: ChatInputCommandInteraction & any, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const type = interaction.options.getSubcommand();
            const server = interaction.options.get("server").value;

            let result = null;

            const data = await API.findOne({ _id: interaction.user.id });

            if(!data || !data.private_panel_key) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} You have not set your private panel API key! Run </set-private-api-key:${client.commandIds.get("set-private-api-key")}> to set it.`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            try {
                const res = await axios.post(`https://${main.privatePanel}/api/client/servers/${server}/power`, {
                    signal: type
                }, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${data.private_panel_key}`,
                        "User-Agent": "william"
                    }
                })

                result = res.status;
            } catch(err) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} ${err.message}`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            const success = new Discord.EmbedBuilder()
                .setColor(client.config_embeds.default)
                .setDescription(`${emoji.tick} Request succeeded with with status code ${result}`)

            await interaction.editReply({ embeds: [success] });
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    },
    async autocomplete(interaction: AutocompleteInteraction, client: ExtendedClient) {
        const option = interaction.options.getFocused(true);

        if(option.name === "server") {
            let result = null;

            let choices: any[] = [];

            const data = await API.findOne({ _id: interaction.user.id });
            if(!data || !data.private_panel_key) return await interaction.respond(choices);

            // Get servers from Pterodactyl API
            try {
                const res = await axios.get(`https://${main.privatePanel}/api/client`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${data.private_panel_key}`,
                        "User-Agent": "william"
                    }
                })

                result = res.data.data;
            } catch(err) {
                await interaction.respond(choices);
                return;
            }

            if(!result) return await interaction.respond(choices);

            // Loop through servers
            for(const server of result) {
                // Push server name to choices array
                choices.push({
                    name: `${server.attributes.name} (${server.attributes.identifier})`,
                    value: server.attributes.identifier
                })
            }

            choices = choices.filter(choice => choice.name.toLowerCase().includes(option.value.toLowerCase()));

            if(choices.length > 25) choices.length = 25;

            // Respond with choices
            await interaction.respond(choices);
        }
    }
}

export = command;
