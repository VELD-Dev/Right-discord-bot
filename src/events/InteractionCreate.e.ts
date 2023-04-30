import { Client, CommandInteraction, Interaction } from "discord.js";
import { readFileSync } from "fs";
import { RIGHT } from "../index";
import { LanguageHandler } from "../localizations/LanguageHandler";
import { Types } from "../types/Types";

const authors = JSON.parse(readFileSync("{0}/configs/authors.json".format(_dirname)).toString());

export default async function(client: Client, interaction: Interaction): Promise<any> {
    let localeKeys = Object.keys(Types.ELang);
    let interactionLocale = localeKeys.some(k => interaction.locale.startsWith(k)) ? Types.ELang[localeKeys.find(v => v.startsWith(interaction.locale))] : Types.ELang[0];
    console.log(interactionLocale)
    const LN = new LanguageHandler(interactionLocale);
    if(interaction.isCommand()) {
        const command = bot.commands.find(c => c.name === interaction.commandName);

        await interaction.channel.sendTyping();
        console.time('processing_command');
        if(command.category.toLowerCase().match(/d[ée]v/gi) && !/(404288409608257536)/g.test(interaction.user.id))
            return interaction.reply({ content: await LN.getString(""), ephemeral: true });
        console.timeEnd('processing_command')
    }
}