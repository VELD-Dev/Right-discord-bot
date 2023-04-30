import { Client, Collection, IntentsBitField, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { createWriteStream, readdir, readdirSync } from "fs";
import { Utils } from "./utils/Utils";
import { Types } from "./types/Types";
import de from "dotenv";
global._dirname = __dirname;
de.config({ path: _dirname + '/../.env' })

export namespace RIGHT {
    export class Bot {
        public commands: Collection<string, Types.ICommand>;
        public slashCommands: RESTPostAPIApplicationCommandsJSONBody[];
        public catDirnames: string[];
        public categories: string[]
        public client: Client;
        public constructor(token: string) {
            // Client object
            this.client = new Client({ intents: [
                /* DM Intents */
                IntentsBitField.Flags.DirectMessages,
                IntentsBitField.Flags.DirectMessageReactions,
                IntentsBitField.Flags.DirectMessageTyping,
                /* Guilds Intents */
                IntentsBitField.Flags.GuildBans,
                IntentsBitField.Flags.GuildEmojisAndStickers, // Emojis & stickers use
                IntentsBitField.Flags.GuildIntegrations,
                IntentsBitField.Flags.GuildInvites, // Invite counter, rewards, etc...
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessageReactions,
                IntentsBitField.Flags.GuildMessageTyping,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildPresences,
                IntentsBitField.Flags.GuildScheduledEvents,
                IntentsBitField.Flags.GuildVoiceStates,
                IntentsBitField.Flags.GuildWebhooks,
                IntentsBitField.Flags.Guilds,
                /* Misc. Intents */
                IntentsBitField.Flags.MessageContent // Used for auto-moderation, mini-games and leveling system.
            ]})

            // external variables (not in global.d.ts because 2lzy)
            this.commands = new Collection<string, Types.ICommand>();
            this.slashCommands = [];
            this.catDirnames = readdirSync(_dirname + '/commands/', { withFileTypes: true }).filter((v) => v.isDirectory()).map(dir => dir.name);
            this.categories = [];

            try {
                // Loads event files
                readdir(`${_dirname}/events/`, (err, files) => {
                    if(err) throw new Error("[RIGHT] - Failed at reading events files", { cause: err });
                    files.forEach(async file => {
                        if(!file.endsWith(".e.js")) return;
                        let event = require(`./events/${file}`).default;
                        let eventName = file.split(".")[0];
                        this.client.on(eventName, event.bind(null, this.client))
                        console.log("[RIGHT] - Event {0} loaded successfully".format(file))
                    })
                    console.log("[RIGHT] - Loaded successfully {0} events.".format(files.length))
                })
            } catch (err) {
                throw new Error("E [RIGHT] - Failed at loading events.", { cause: err })
            }

            try {
                this.catDirnames.forEach(async dir => {
                    if(!/(c\..+)/ig.exec(dir)) return;
                    this.categories.push(dir.split(".")[1]);
                    readdir(`${_dirname}/commands/${dir}/`, async (err, files) => {
                        if(err) throw new Error(`An error has ocurred with code ${err.code} while starting commands handler: ${err.message}`, { cause: err.cause });
                        let commandFiles = files.filter(c => c.endsWith("c.js"));
                        for(const element of commandFiles) {
                            try {
                                let command = (await import(`./commands/${dir}/${element}`)).obj;
                                this.commands.set(command.name, command);
                                this.slashCommands.push(command.data);
                                console.log("[RIGHT] - (/) Slash command {0} in {1} loaded successfully".format(element, dir));
                            } catch (err) {
                                console.log("E [RIGHT] - (/) Slash command {0} in {1} failed at loading.\n{2}".format(element, dir, err));
                            }
                        }
                    });
                });
            } catch (err) {
                throw new Error("E [RIGHT] - Failed at loading commands scripts", { cause: err })
            }

            this.client.login(process.env.TOKEN).then(() => {
                const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
                try {
                    console.log("[RIGHT] - Started refreshing (/) Slash commands.");
                    rest.put(
                        Routes.applicationCommands(this.client.user.id),
                        { body: this.slashCommands }
                    );
                    console.log("[RIGHT] - Successfully reloaded (/) Slash commands");
                } catch (err) {
                    throw Error("E [RIGHT] - Failed at reloading of (/) Slash commands", { cause: err })
                }
            })
        }
    } 
}

(() => {
    Utils.LogToFile();
    bot = new RIGHT.Bot(process.env.TOKEN)
    return bot;
})();