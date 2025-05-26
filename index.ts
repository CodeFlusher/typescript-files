import {knownModes, useParser} from "./console_parser/parser";
import {Arguments} from "./console_parser/arguments.ts";
import {translateScript} from "./scripts/translate.ts";
import {aiRequest} from "./scripts/ai.ts";

const { selfName, currentWorkMode } = useParser();

if(currentWorkMode!.slug === "help") {
    console.log("CodeFlusher Typescript Files")
    console.log(`Usage: ./${selfName} [args]`)
    const longestMode = knownModes.map(mode => mode.commands.join(' | ').length).reduce((v1,v2)=> Math.max(v1,v2))
    knownModes.forEach(knownMode => {
        console.log(`   ${knownMode.commands.join(' | ')}${ ' '.repeat(longestMode - knownMode.commands.join(' | ').length + 1) } ${knownMode.info}`);
    })
    console.log("Arguments: ")
    const longerArg = Object.entries(Arguments).map(([key, arg]) => arg.arg.length).reduce((v1,v2)=> Math.max(v1,v2));
    Object.entries(Arguments).forEach((value) => {
        console.log(`   ${value[1].arg}${' '.repeat(longerArg - value[1].arg.length + 1)} ${value[1].info}`.concat(value[1].default ? `Default: ${value[1].default}` : ''));
    })
}
if(currentWorkMode!.slug === "translate") {
    translateScript().then(_ => {})
}

if(currentWorkMode!.slug === "ai") {
    aiRequest().then(_ => {})
}

