import { Client, CommandInteraction, PermissionsBitField, RESTPostAPIApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";
import { LanguageHandler } from "../localizations/LanguageHandler.js";

export interface ICommand {
    name: string;
    description: string;
    usage: string;
    category: string;
    permissions?: PermissionsBitField;
    data: RESTPostAPIApplicationCommandsJSONBody;
    execute(client: Client, interaction: CommandInteraction, interactionLocale: LanguageHandler): Promise<void> | void;
}