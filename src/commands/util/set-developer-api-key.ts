import Command from "../../classes/Command";
import ExtendedClient from "../../classes/ExtendedClient";
import { ChatInputCommandInteraction } from "discord.js";

import axios from "axios";
import { emojis as emoji, main } from "../../config";

import API from "../../models/API";

const command: Command = {
    name: "set-developer-api-key",
    description: "Set your API key for the developer panel.",
    options: [
        {
            type: 3,
            name: "api-key",
            description: "Your API key for the developer panel.",
            min_length: 48,
            max_length: 48,
            required: true
        }
    ],
    default_member_permissions: null,
    botPermissions: [],
    cooldown: 60,
    enabled: true,
    ownerOnly: false,
    deferReply: true,
    ephemeral: true,
    async execute(interaction: ChatInputCommandInteraction & any, client: ExtendedClient, Discord: typeof import("discord.js")) {
        try {
            const key = interaction.options.get("api-key").value;

            const regex = /^ptlc_[A-Za-z0-9]{43}$/;

            if(!regex.test(key)) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} Your API key is invalid!`)

                await interaction.editReply({ embeds: [error] });
                return;
            }

            try {
                const res = await axios.get(`https://${main.developerPanel}/api/client/account`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${key}`,
                        "User-Agent": "william"
                    }
                })

                if(res.status === 200) {
                    // Save the API key to the database
                    const data = await API.findOne({ _id: interaction.user.id }) || new API({ _id: interaction.user.id });
                    data.developer_panel_key = key;

                    await data.save();

                    const set = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.default)
                        .setDescription(`${emoji.tick} Your developer panel API key has been set!`)

                    await interaction.editReply({ embeds: [set] });
                    return;
                } else {
                    const error = new Discord.EmbedBuilder()
                        .setColor(client.config_embeds.error)
                        .setDescription(`${emoji.cross} Your developer panel API key could not be verified!`)
                        .addFields (
                            { name: "Status Code", value: `**${res.status}** ${res.statusText}` },
                            { name: "Possible Reasons", value: `- You have provided an invalid API key\n- Your API key is IP restricted` }
                        )

                    await interaction.editReply({ embeds: [error] });
                    return;
                }
            } catch(err) {
                const error = new Discord.EmbedBuilder()
                    .setColor(client.config_embeds.error)
                    .setDescription(`${emoji.cross} Your API key could not be verified!`)
                    .addFields (
                        { name: "Status Code", value: `**${err.response.status}** ${err.response.statusText}` },
                        { name: "Possible Reasons", value: `- The developer panel is down\n- You have provided an invalid API key\n- Your API key is IP restricted` }
                    )

                await interaction.editReply({ embeds: [error] });
                return;
            }
        } catch(err) {
            client.logCommandError(err, interaction, Discord);
        }
    }
}

export = command;
