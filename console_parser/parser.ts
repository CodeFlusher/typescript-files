import {type CommandArgument, CommandArgumentValidator, type SuperArgument, type WorkMode} from "./types.ts";
import {Arguments} from "./arguments.ts";

export const knownModes: WorkMode[] = [
    {
        slug: 'help',
        commands: ['-h', '-help'],
        info: "Displays help for program"
    },
    {
        slug: 'translate',
        commands: ['-t', '-translate'],
        info: "Translates text given amount of times",
        arguments: [
            new CommandArgumentValidator('or', [Arguments.FILE, Arguments.DATA]),
            new CommandArgumentValidator('optional', [Arguments.TIMES]),
            new CommandArgumentValidator('optional', [Arguments.LANG_VIA, Arguments.LANG_TO]),
        ]
    },
    {
        slug: "ai",
        commands: ['-a', '-ai'],
        info: "Sends request to Gemma",
        arguments: [
            new CommandArgumentValidator('or', [Arguments.FILE, Arguments.DATA]),
        ]
    }
]

export const SuperArguments: SuperArgument[] = [
    {
        slug: "debug",
        args: ['-d', '-debug'],
        info: "Displays debug for program"
    }
]

let currentWorkMode: WorkMode | undefined = undefined;
let parsedParams = new Map<string, string>()

export function useParser() {
    const args = Bun.argv;
    const selfName = args[0];

    let flagToExit = false;

    const findMode = (mode: string[]): boolean => {
        for (let argument of args) {
            if (mode.indexOf(argument) !== -1) {
                return true;
            }
        }
        return false;
    }

    const getAny = (args: string[]) => {
        return args.map(arg => arg.slice(arg.indexOf("=") + 1)).filter(it => !!it).pop();
    }

    if (!currentWorkMode) {

        for(const superArg of SuperArguments){
            if(!findMode(superArg.args)){
                continue;
            }
            parsedParams.set(superArg.slug, getAny(superArg.args) || "none");
        }

        for (const mode of knownModes) {

            if (!findMode(mode.commands)) {
                continue
            }
            if (currentWorkMode) {
                console.error("Cannot execute multiple tasks at once! Exiting....")
                process.exit(1);
            }
            currentWorkMode = mode;
        }
        if (!currentWorkMode) {
            currentWorkMode = knownModes[0];
        }

        if (currentWorkMode!.arguments) {
            for (let argument of currentWorkMode!.arguments) {
                const {result, message, parsed} = argument.parse(args)
                if (!result) {
                    console.error(message)
                    flagToExit = true;
                } else {
                    parsed.forEach(item => {
                        parsedParams.set(item.key, item.value);
                    });
                }
            }
        }

    }


    if (flagToExit) {
        process.exit(1);
    }

    return {selfName, args, currentWorkMode, parsedParams};
}