import { Client } from "discord.js";
import {} from "../utils/String.js";

export default async function(client: Client) {
    console.log("[RIGHT] - RIGHT is now online.")
    
    client.user.setStatus("online");

    let activityNames: string[] = [ "/help | Add me!", "Dev tip: Check the Github!", "Discord-bot Simulator 2022 (Add RIGHT on your Server)"]
    let activityTypes: string[] = [ "LISTENING", "WATCHING", "PLAYING"]
    client.user.setPresence({
        activities: activityNames.map((an, i) => new Object({ name: an[i], type: activityTypes[i], url: "https://www.weebnovel.fr/" }))
    })
}