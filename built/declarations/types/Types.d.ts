import { Client, CommandInteraction, PermissionsBitField, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { LanguageHandler } from "../localizations/LanguageHandler.js";
export declare namespace Types {
    interface ICommand {
        name: string;
        description: string;
        usage: string;
        category: string;
        permissions?: PermissionsBitField;
        data: RESTPostAPIApplicationCommandsJSONBody;
        execute(client: Client, interaction: CommandInteraction, interactionLocale: LanguageHandler): Promise<void> | void;
    }
    interface ILangObject {
        [key: string]: string;
    }
    enum ELang {
        EN = 0,
        FR = 1
    }
}
