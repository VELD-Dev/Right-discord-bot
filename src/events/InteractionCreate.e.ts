import { Client, CommandInteraction, PermissionsBitField } from "discord.js";
import { readFileSync } from "fs";
import { commands } from "../index.js";
import { LanguageHandler } from "../localizations/LanguageHandler.js";
import { ELang } from "../types/ELang.js";
import "../types/String.js";

const authors = JSON.parse(readFileSync("{0}/configs/authors.c.json".format(_dirname)).toString());

export default async function(client: Client, interaction: CommandInteraction): Promise<any> {
    let interactionLocale = Object.keys(ELang).some(k => interaction.locale.startsWith(k)) ? interaction.locale.split("-")[0].toUpperCase() : ELang[0];
    const LN = new LanguageHandler(interactionLocale);
    if(interaction.isCommand()) {
        const command = commands.find(c => c.name === interaction.commandName);

        console.time('processing_command');
        await interaction.channel.sendTyping();
        if(command.category.toLowerCase().match(/dev/gi) && new RegExp('({0})'.format(authors.map(a => a.id).join("|"))).test(interaction.user.id))
            return interaction.reply({ content: (await LN.getString("err.403")).format("DEVELOPER_ONLY"), ephemeral: true });
        if(command.permissions) {
            if(!interaction.memberPermissions.has(command.permissions))
                return interaction.reply({ content: (await LN.getString("err.403")).format(`PERMISSIONS_MISSING: [${command.permissions.toArray().join(", ")}]`) });
            try {
                await command.execute(client, interaction, LN)
                console.log(`[RIGHT] - Moderation command ${interaction.commandName} executed by ${interaction.user.tag} on server ${interaction.guild.name}`)
            } catch (err) {
                console.log(`[RIGHT] - An error has occurred with command ${interaction.commandName}: ${err}`)
                return interaction.channel.send({ content: (await LN.getString("err.500")).format(`ERROR_500:\n${err}`) }).then(m => setTimeout(() => {m.delete()}, 5000))
            }
        } else {
            try {

                await command.execute(client, interaction, LN);
                console.log(`[RIGHT] - Command ${interaction.commandName} executed by ${interaction.user.tag} on server ${interaction.guild.name}`)
            } catch (err) {
                console.log(`[RIGHT] - An error has occurred with command ${interaction.commandName}: ${err}`)
                return interaction.channel.send({ content: (await LN.getString("err.500")).format(`ERROR_500:\n${err}`) }).then(m => setTimeout(() => {m.delete()}, 5000))
            }
        }
        console.timeEnd('processing_command')
    }
}