import Util from "util"
import { createWriteStream } from "fs"

export namespace Utils {
    export function LogToFile(): void {
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
    }
}