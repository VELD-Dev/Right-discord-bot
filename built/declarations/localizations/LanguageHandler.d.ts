import { Types } from "../types/Types";
import "../utils/String.js";
export declare class LanguageHandler {
    static readonly defaultLanguage: any;
    readonly language: string;
    private static loadedLanguages;
    constructor(language?: Types.ELang);
    getString(identifier: string, ...args: any[]): Promise<string>;
    static getString(identifier: string, ...args: any[]): Promise<string>;
    private static encacheLanguage;
}
