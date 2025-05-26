export type CommandArgument = {
    arg: string;
    info: string;
    default?: string;
}

export type SuperArgument = {
    slug: string;
    args: string[];
    info: string;
}

type LogicFunctionVariant = 'all' | 'any' | 'or' | 'optional'
type LogicFunction = ((vals: string[]) => boolean)

export class CommandArgumentValidator {

    logicFunction: LogicFunctionVariant;
    args: CommandArgument[];
    filteredArgs: string[]

    constructor(logicFunction: LogicFunctionVariant, args: CommandArgument[]) {
        this.logicFunction = logicFunction;
        this.args = args;
        this.filteredArgs = this.args.map((arg) => arg.arg);
    }

    getValidationFunction(): LogicFunction {
        switch (this.logicFunction) {
            case "all":
                return (vals) => vals.map(arg => this.filteredArgs.indexOf(arg) !== -1).reduce((a, b) => a && b);

            case "any":
                return (vals) => vals.map(arg => this.filteredArgs.indexOf(arg) !== -1).reduce((a, b) => a || b);

            case "or":
                return (vals) => vals.map(arg => this.filteredArgs.indexOf(arg) !== -1).length === 1;

            default:
                return () => true;
        }
    }

    getErrorMessage(mappedArgs: string[]) {
        switch (this.logicFunction) {
            case "all":
                return `All arguments should be present! \n\nExpected: [${this.filteredArgs.join(', ')}] \nGot: ${mappedArgs.join(', ')}`;
            case "any":
                return `At least one argument should be present! \n\nExpected: [${this.filteredArgs.join(', ')}] \nGot: ${mappedArgs.join(', ')}`
            case "or":
                return mappedArgs.length === 0 ? `No arguments were passed! 

 Expected: [${this.filteredArgs.join(', ')}]` : `Only one value should be present! \n\nAny: [${this.filteredArgs.join(', ')}] \nGot: ${mappedArgs.join(', ')}`
            default:
                return "Impossible case! If you see this message, please try again! If you see this message again, contact the dev.";
        }
    }

    parse(parse_args: string[]) {
        const mappedArgs: string[] = parse_args.map((arg) => arg.slice(0, arg.indexOf("=")));
        const tempParams = this.filteredArgs.map(v => v.slice(2));
        let parsed = parse_args.map((arg) => {
            return {
                key: arg.slice(0, arg.indexOf("=")).slice(2),
                value: arg.slice(arg.indexOf("=") + 1),
            }
        });
        if(this.logicFunction === "optional"){
            for (let arg of this.args) {
                if(!(parsed.findIndex(x => x.key === arg.arg.slice(2)) > 0)){
                    parsed.push({
                        key: arg.arg.slice(2),
                        value: arg.default!
                    })
                }
            }
        }
        parsed = parsed.filter(x => tempParams.findIndex(v => v === x.key) !== -1);
        const result = this.getValidationFunction()(mappedArgs.filter((arg) => this.filteredArgs.includes(arg)));
        return {
            result,
            message: result ? undefined : this.getErrorMessage(mappedArgs.filter((arg) => this.filteredArgs.includes(arg))),
            parsed
        };
    }
}

export type WorkMode = {
    slug: string;
    commands: string[];
    info: string;
    arguments?: CommandArgumentValidator[];
}
