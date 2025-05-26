import {useParser} from "../console_parser/parser.ts";
import {FileSystem} from "../file/file.ts";
import {CommandLineArguments} from "../console_parser/getDataOrFIle.ts";

export async function translateScript() {
    const {parsedParams} = useParser()
    let data = await CommandLineArguments.getDataOrFile(parsedParams)

    const isDebug = parsedParams.has('debug')
    if (isDebug) {
        console.log("Debugging Mode")
    }
    const languageTo = parsedParams.get('target_language')
    const languageVia = parsedParams.get('via_language')

    const amount = Number.parseInt(parsedParams.get('times')!)
    if (isDebug) {
        console.log(languageVia)
        console.log(languageTo)
        console.log(amount)
        console.log(data)
    }

    for (let i = 0; i < amount; i++) {
        let res = await fetch("http://localhost:5000/translate", {
            method: "POST",
            body: JSON.stringify({
                q: data,
                source: "auto",
                target: languageVia,
                alternatives: 1,
            }),
            headers: {"Content-Type": "application/json"},
        }).then(res => res.json());

        console.log(res)
        data = (res as { translatedText: string, alternatives: string[] }).alternatives[0]!;

        res = await fetch("http://localhost:5000/translate", {
            method: "POST",
            body: JSON.stringify({
                q: data,
                source: "auto",
                target: languageTo,
                alternatives: 1,
            }),
            headers: {"Content-Type": "application/json"},
        }).then(res => res.json());

        console.log(res)

        data = (res as { translatedText: string, alternatives: string[] }).alternatives[0]!;
    }

    await FileSystem.writeToFile("translation", "translate", data)
}