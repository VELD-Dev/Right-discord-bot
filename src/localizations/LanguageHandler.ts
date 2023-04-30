import { readFileSync } from "fs";
import { Types } from "../types/Types";
import "../utils/String.js";

/**Language handler of RIGHT Bot */
export class LanguageHandler {
    public static readonly defaultLanguage = Types.ELang[0];
    readonly language: string;
    private static loadedLanguages: Map<Types.ELang, Types.ILangObject> = new Map<Types.ELang, Types.ILangObject>();
    /**
     * Creates a languageHandler instance with a language set
     * @param language language of the LanguageHandler instance
     */
    public constructor(language: Types.ELang = null) {
        if(typeof(language) == "number") {
            this.language = Types.ELang[language];
        } else if(typeof(language) == "string") {
            this.language = language;
        } else {
            this.language = Types.ELang[0];
        }
        if(!Object.values(Types.ELang).includes(this.language)) throw new Error(`Choosen language is inexistant among the implemented languages: [${Object.keys(Types.ELang).join(", ")}]`, { cause: "unknown language" })
    }

    /**Get the string of a translation by the language of *this* instance
     * @param identifier Key (translationID) of the string.
     * @arguments Strings for formatting
     * @returns String of the translation formatted (if implemented). 
     */
    public async getString(identifier: string, ...args: any[]): Promise<string> {
        let LO = await LanguageHandler.encacheLanguage(Types.ELang[this.language]);
        let value = LO[identifier] ? LO[identifier].format(...args) : LanguageHandler.getString(identifier, args);
        return value;
    }

    /**Get the string of default translation (EN / English)
     * @param identifier Key (translationID) of the string
     * @arguments Strings for formatting
     * @returns String of the translation (formatted if implemented)
     */
    public static async getString(identifier: string, ...args: any[]): Promise<string> {
        let LO = await LanguageHandler.encacheLanguage(Types.ELang.EN);
        let value = LO[identifier] ? LO[identifier].format(...args) : identifier;
        return value;
    }

    /**Put in languages cache the language
     * @param lang Language to put in cache
     * @returns ILangObject reference of the language
     */
    private static async encacheLanguage(lang: Types.ELang): Promise<Types.ILangObject> {
        if(LanguageHandler.loadedLanguages.has(lang)) return LanguageHandler.loadedLanguages.get(lang);

        let langFile: Types.ILangObject = JSON.parse(readFileSync(_dirname + '/localizations/' + Types.ELang[lang].toLowerCase() + '.json').toString()) as Types.ILangObject;
        LanguageHandler.loadedLanguages.set(lang, langFile);
        console.log("[LH] - A new language have been added to cache.")
        return langFile;
    }
}