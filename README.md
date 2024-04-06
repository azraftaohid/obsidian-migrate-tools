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
Currently, this tool can handle the following tasks:

### File create time
It automatically updates the creation time of .md note files based on their properties. The note must include a property named "created", and its value must be a valid date-time string. For example:
```
---
Other prop: value
Created: <date_string>
Another prop: value
---
```
Note: property name is case-insensitive and value may or may not be wrapped inside double quotation marks ("...").

## License
All files on the obsidian-migrate-tools GitHub repository are subject to the MIT License. Please read the [LICENSE](LICENSE) file at the root of the project.
