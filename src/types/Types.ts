import { Client, CommandInteraction, PermissionsBitField, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { LanguageHandler } from "../localizations/LanguageHandler.js";

export namespace Types {
    export interface ICommand {
        name: string;
        description: string;
        usage: string;
        category: string;
        permissions?: PermissionsBitField;
        data: RESTPostAPIApplicationCommandsJSONBody;
        execute(client: Client, interaction: CommandInteraction, interactionLocale: LanguageHandler): Promise<void> | void;
    }

    export interface ILangObject {
        [key: string]: string
    }

    export enum ELang {
        EN,
        FR,
    }
}