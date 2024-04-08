# obsidian-migrate-tools
This tool facilitates necessary adjustments to exported .md files for [Obsidian](https://obsidian.md/) usage. The guidelines provided here are a continuation of [this document](https://1drv.ms/u/s!AnZtASMIIJGgod52N2B4xLByF9OpTg?e=4YtglN).

## Setup and use
In order to use this tool, follow these steps:
 - Clone [the](https://github/azraftaohid/obsidian-migrate-tools) repository.
 - Initialize the project by executing `yarn` within the command line at the root of the cloned repository.
 - Modify the [config](src/config.ts) file to set the `workingDir` property to the path of your target Obsidian files.  
 Note: for Windows users, ensure to escape the backward-slash (\\) character.
 - Finally, run:
```bash
yarn start
```

## Current capabilities
Capabilities of the program can be set by modifying the function passed to `forEachMarkdown` at the bottom of [index.ts](./src/index.ts) file.
```typescript
forEachMarkdown(config.workingDir, updateBirthTime);
```

Currently, this tool can handle the following tasks:

### File create time
It automatically updates the creation time of .md note files based on their properties using the `updateBirthTime` function. The note must include a property named "created", and its value must be a valid date-time string. For example:
```
---
Other prop: value
Created: <date_string>
Another prop: value
---
```
Note: property name is case-insensitive and value may or may not be wrapped inside double quotation marks ("...").

### File rename
It can rename .md files to match either it's title property or parent name. In the case of title property, any unsupported characters are replaced by white-space (` `). To update filename by parent's name, use the `applyParentName` function. And to use the title property, use the `applyTitleAsName` function.

## License
All files on the obsidian-migrate-tools GitHub repository are subject to the MIT License. Please read the [LICENSE](LICENSE) file at the root of the project.
