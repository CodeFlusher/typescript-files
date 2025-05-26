import {FileSystem} from "../file/file.ts";
import {CommandLineArguments} from "../console_parser/getDataOrFIle.ts";
import {useParser} from "../console_parser/parser.ts";

export async function aiRequest(){
    const {parsedParams} = useParser()
    const data = await CommandLineArguments.getDataOrFile(parsedParams)

    const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        body: JSON.stringify({
            model: "gemma3",
            prompt: data,
            stream: false
        }),
        headers: {
            "Content-Type": "application/json",
        }
    })

    // @ts-ignore
    await FileSystem.writeToFile("ai", "ai_output", (await res.json()).response)
}