import { RIGHT } from "../index.js";

declare global {
    interface String {
        /**
         * Format a string with the arguments you put into (works if string contains {0}, {1}, {2}, etc... and is counting up -- if {0} appears two times, both will be replaced by the first value you put into).
         * @arguments Arguments of replacement.
         * @returns Formatted string
         */
        format(...args): string;
    }
    var _dirname: string;
    var bot: RIGHT.Bot;
}

export {};