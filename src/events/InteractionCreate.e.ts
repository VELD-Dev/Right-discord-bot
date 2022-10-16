import { Client, CommandInteraction, PermissionsBitField } from "discord.js";
import { readFileSync } from "fs";
import { commands } from "..";
import { LanguageHandler } from "../localizations/LanguageHandler";
import { ELang } from "../types/ELang";
const authors = JSON.parse(readFileSync("../configs/authors.c.json").toString());

export default function(client: Client, interaction: CommandInteraction): any {
    let interactionLocale = Object.keys(ELang).some(k => interaction.locale.startsWith(k)) ? interaction.locale.split("-")[0].toUpperCase() : ELang[0];
    const LN = new LanguageHandler(interactionLocale);
    if(interaction.isCommand()) {
        const command = commands.find(c => c.name === interaction.commandName);

        if(command.category.toLowerCase().match(/dev/gi) && new RegExp('({0})'.format(authors.map(a => a.id).join("|"))).test(interaction.user.id))
            return interaction.reply({ content: LN.getString("err.403").format("DEVELOPER_ONLY"), ephemeral: true });
        if(command.permissions) {
            if(command.permissions) // NOT DONE /////// WORK IN PROGRESS
                return interaction.reply({ content: LN.getString("err.403").format(`PERMISSIONS_MISSING: [${command.permissions.}]`)})
        }
    }
}