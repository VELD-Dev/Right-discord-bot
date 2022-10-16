import { ELang } from "../types/ELang";
import { ILangObject } from "../types/ILangObject";

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
    public getString(identifier: string, ...args: any[]): string {
        let LO = LanguageHandler.encacheLanguage(ELang[this.language]);
        
        let value = LO[identifier].format(args);
        return value;
    }

    /**Get the string of default translation (EN / English)
     * @param identifier Key (translationID) of the string
     * @arguments Strings for formatting
     * @returns String of the translation (formatted if implemented)
     */
    public static getString(identifier: string, ...args: any[]): string {
        let LO = LanguageHandler.encacheLanguage(ELang.EN);

        let value = LO[identifier].format(args);
        return value;
    }

    /**Put in languages cache the language
     * @param lang Language to put in cache
     * @returns ILangObject reference of the language
     */
    private static async encacheLanguage(lang: ELang): Promise<ILangObject> {
        if(LanguageHandler.loadedLanguages.has(lang)) return LanguageHandler.loadedLanguages.get(lang);

        let langFile: ILangObject = await import(`./${Object.keys(ELang)[lang]}.json,`) as ILangObject;
        LanguageHandler.loadedLanguages.set(lang, langFile);
        console.log("[LH] - A new language have been added to cache.")
        return langFile;
    }
}

LanguageHandler.getString("Cat.info.name") // renvoie "Information" (EN)
new LanguageHandler("FR").getString("Cat.info.name") // renvoie "Informations" (FR)