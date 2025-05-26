import type {CommandArgument} from "./types.ts";

export const Arguments = {
    FILE: {
        arg: "--file",
        info: "Asserts that data is contained in a file and should be read from it",
    } as CommandArgument,
    DATA: {
        arg: "--data",
        info: "Inlines data to command argument",
    } as CommandArgument,
    TIMES: {
        arg: "--times",
        info: "How many times script should be ran",
        default: '10',
    } as CommandArgument,
    LANG_TO: {
        arg: "--target_language",
        info: "Language that will be on output of execution",
        default: "en"
    } as CommandArgument,
    LANG_VIA: {
        arg: "--via_language",
        info: "Language that will used to translate",
        default: "zh"
    } as CommandArgument,
}
