export const FileSystem = {
    writeToFile: async (address: string, title:string, data: string) => {
        await Bun.write(`output/${address}/${title}_${new Date().toLocaleString().replaceAll('/', '_').replaceAll(',', '').replaceAll(' ', '_').replaceAll(':', '_')}.md`, data)
    }
}