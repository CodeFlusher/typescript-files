export const CommandLineArguments = {
    getDataOrFile: async (parsedParams: Map<string, string>) => {
        return parsedParams.has('file') ? await (async () => {
            const path = parsedParams.get("file")
            if (!path) {
                console.error("Couldn't find file from the argument")
                process.exit(1)
            }
            const file = Bun.file(path!)
            if (!await file.exists()) {
                console.error("Couldn't find file from the argument")
                process.exit(1)
            }
            return await file.text()
        })() : parsedParams.get('data')!
    },
}
