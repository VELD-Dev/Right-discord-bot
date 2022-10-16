import { Client, CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { ELang } from "./ELang";

export interface ICommand {
    name: string;
    description: string;
    usage: string;
    category: string;
    permissions: PermissionsBitField;
    data: SlashCommandBuilder;
    execute(client: Client, interaction: CommandInteraction, interactionLocale: ELang): void;
}