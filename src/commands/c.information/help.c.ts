import { EmbedBuilder, RESTPostAPIApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";
import { commands } from "../../index.js";
import { ICommand } from "../../types/ICommand.js";
import "../../types/String.js";

let data: RESTPostAPIApplicationCommandsJSONBody = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Gives a list of every commands, or specific info of one command.")
    .addStringOption(o => o.setName("command_name")
        .setDescription("Name of the command to get information")
        .setRequired(false)
    )
    .toJSON();

export const obj: ICommand = {
    name: "help",
    category: "information",
    description: "c.information.help.g.desc",
    usage: "args?: command_name",
    data: data,
    async execute(client, interaction, LN) {
        let embed = new EmbedBuilder()
            .setTitle(await LN.getString("c.information.help.e1.title"))
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ size: 128, extension: "png" }) })
            .setDescription((await LN.getString("c.information.help.e1.desc", commands.size, '`' + commands.map(c => c.name).join("`, `") + '`')))
            .setColor("Blurple")
            .setFooter({ text: await LN.getString("c.information.help.e1.footer", interaction.guild.name), iconURL: interaction.guild.iconURL({ size: 128, extension: "png" }) })
        interaction.reply({ embeds: [embed], ephemeral: true })
    },
}