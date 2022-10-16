import { readFileSync } from "fs";
import { ELang } from "../types/ELang.js";
import { ILangObject } from "../types/ILangObject.js";
import "../types/String.js";

/**Language handler of RIGHT Bot */
export class LanguageHandler {
    public static readonly defaultLanguage = "EN";
    readonly language: string;
    private static loadedLanguages: Map<ELang, ILangObject> = new Map<ELang, ILangObject>();
    /**
     * Creates a languageHandler instance with a language set
     * @param language language of the LanguageHandler instance
     */
    public constructor(language: string = null) {
        this.language = language || "EN";
        if(!Object.keys(ELang).includes(this.language)) throw new Error(`Choosen language is inexistant among the implemented languages: [${Object.keys(ELang).join(", ")}]`, { cause: "unknown language" })
    }

    /**Get the string of a translation by the language of *this* instance
     * @param identifier Key (translationID) of the string.
     * @arguments Strings for formatting
     * @returns String of the translation formatted (if implemented). 
     */
    public async getString(identifier: string, ...args: any[]): Promise<string> {
        let LO = await LanguageHandler.encacheLanguage(ELang[this.language]);
        let value = LO[identifier] ? LO[identifier].format(args) : LanguageHandler.getString(identifier, args);
        return value;
    }

    /**Get the string of default translation (EN / English)
     * @param identifier Key (translationID) of the string
     * @arguments Strings for formatting
     * @returns String of the translation (formatted if implemented)
     */
    public static async getString(identifier: string, ...args: any[]): Promise<string> {
        let LO = await LanguageHandler.encacheLanguage(ELang.EN);
        let value = LO[identifier] ? LO[identifier].format(args) : identifier;
        return value;
    }

    /**Put in languages cache the language
     * @param lang Language to put in cache
     * @returns ILangObject reference of the language
     */
    private static async encacheLanguage(lang: ELang): Promise<ILangObject> {
        if(LanguageHandler.loadedLanguages.has(lang)) return LanguageHandler.loadedLanguages.get(lang);

        let langFile: ILangObject = JSON.parse(readFileSync(_dirname + '/localizations/' + Object.keys(ELang)[lang] + '.json').toString()) as ILangObject;
        LanguageHandler.loadedLanguages.set(lang, langFile);
        console.log("[LH] - A new language have been added to cache.")
        return langFile;
    }
}

LanguageHandler.getString("Cat.info.name") // renvoie "Information" (EN)
new LanguageHandler("FR").getString("Cat.info.name") // renvoie "Informations" (FR)