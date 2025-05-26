# ts

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```
This will put out help data for the programm.

Currently available scripts are:

## Translation
Translates targeted file or inlined data 10 times (can be customized) to any language and back
By default it's chinese and english
Utilises locally run [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) instance, on 5000 port

## Ai Request
Does generous ai request to Gemma3, running on ollama.
Accepts inline and file data


This project was created using `bun init` in bun v1.2.12. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
