import { Client, Collection, IntentsBitField, REST, RESTPostAPIApplicationCommandsJSONBody, RESTPutAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { createWriteStream, fstat, readdir, readdirSync } from "fs";
import { ICommand } from "./types/ICommand.js";
import { fileURLToPath } from "url"
import Util from "util";
import path from "path";
import "./types/String.js";
import de from "dotenv";

global._dirname = path.dirname(fileURLToPath(import.meta.url));
de.config({ path: _dirname + '/../.env' })

// Log to file
let logFile = createWriteStream("{0}/logs.log".format(global._dirname), { flags: "w" });
let logStdout = process.stdout;
console.log = function(d: any) {
    logFile.write(Util.format(d) + '\n');
    logStdout.write(Util.format(d) + '\n');
};
console.error = function(d: any) {
    logFile.write(Util.format(d) + '\n')
    logStdout.write(Util.format(d) + '\n');
}

// Client object
const client = new Client({ intents: [
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
export let commands: Collection<string, ICommand> = new Collection<string, ICommand>();
export let slashCommands: RESTPostAPIApplicationCommandsJSONBody[] = [];
export let catDirnames: string[] = readdirSync(_dirname + '/commands/', { withFileTypes: true }).filter((v) => v.isDirectory()).map(dir => dir.name);
export let categories: string[] = [];

try {
    // Loads event files
    readdir(`${_dirname}/events/`, (err, files) => {
        if(err) throw new Error("[RIGHT] - Failed at reading events files", { cause: err });
        files.forEach(async file => {
            if(!file.endsWith(".e.js")) return;
            let event = (await import(`./events/${file}`)).default;
            let eventName = file.split(".")[0];
            client.on(eventName, event.bind(null, client))
            console.log("[RIGHT] - Event {0} loaded successfully".format(file))
        })
        console.log("[RIGHT] - Loaded successfully {0} events.".format(files.length))
    })
} catch (err) {
    throw new Error("E [RIGHT] - Failed at loading events.", { cause: err })
}

try {
    catDirnames.forEach(async dir => {
        if(!/(c\..+)/ig.exec(dir)) return;
        categories.push(dir.split(".")[1]);
        readdir(`${_dirname}/commands/${dir}/`, async (err, files) => {
            if(err) throw new Error(`An error has ocurred with code ${err.code} while starting commands handler: ${err.message}`, { cause: err.cause });
            let commandFiles = files.filter(c => c.endsWith("c.js"));
            for(let i = 0; i < commandFiles.length; i++) {
                try {
                    let command = (await import(`./commands/${dir}/${commandFiles[i]}`)).obj;
                    commands.set(command.name, command);
                    slashCommands.push(command.data);
                    console.log("[RIGHT] - (/) Slash command {0} in {1} loaded successfully".format(commandFiles[i], dir));
                } catch (err) {
                    console.log("E [RIGHT] - (/) Slash command {0} in {1} failed at loading.\n{2}".format(commandFiles[i], dir, err));
                }
            }
        });
    });
} catch (err) {
    throw new Error("E [RIGHT] - Failed at loading commands scripts", { cause: err })
}

client.login(process.env.TOKEN).then(() => {
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
    try {
        console.log("[RIGHT] - Started refreshing (/) Slash commands.");
        rest.put(
            Routes.applicationCommands(client.user.id),
            { body: slashCommands }
        );
        console.log("[RIGHT] - Successfully reloaded (/) Slash commands");
    } catch (err) {
        throw Error("E [RIGHT] - Failed at reloading of (/) Slash commands", { cause: err })
    }
})