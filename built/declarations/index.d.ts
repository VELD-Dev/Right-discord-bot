import { Client, Collection, RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { Types } from "./types/Types";
export declare namespace RIGHT {
    class Bot {
        commands: Collection<string, Types.ICommand>;
        slashCommands: RESTPostAPIApplicationCommandsJSONBody[];
        catDirnames: string[];
        categories: string[];
        client: Client;
        constructor(token: string);
    }
}
