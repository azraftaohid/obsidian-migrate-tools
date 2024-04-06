import fsp from "fs/promises";
import path from "path";
import { utimes } from "utimes";
import { config } from "./config";

async function updateBirthTimes(rootDir: string) {
	const root = path.resolve(rootDir);
	const contents = await fsp.readdir(root, { recursive: true, withFileTypes: true })

	for (const file of contents) {
		if (!file.isFile() || !file.name.endsWith(".md")) continue;

		const absPath = path.resolve(file.path, file.name);
		const publicName = absPath.slice(root.length + 1);
		const content = await fsp.readFile(absPath).then(v => v.toString());

		const props = /---(\n|.)*---/i.exec(content)?.[0];
		if (!props) {
			console.warn("Properties not defined for the file:", publicName);
			continue;
		}

		const createdProp = /created: "?.+"?/i.exec(props)?.[0];
		if (!createdProp) {
			console.warn("Created property not defined for the file:", publicName);
			continue;
		}

		const timestamp = createdProp.slice(9);
		const timestampMs = Date.parse(timestamp.startsWith('"') ? timestamp.slice(1, -1) : timestamp);

		if (Number.isNaN(timestampMs)) {
			console.warn("Can't parse create timestamp for the file:", publicName);
			continue;
		}

		try {
			await utimes(absPath, { btime: timestampMs });
		} catch (error) {
			console.error("Unable to update birth time for file (" + publicName + "):", error);
		}
	}
}

updateBirthTimes(config.workingDir).then(() => {
	console.log("Completed.");
}).catch(error => {
	console.error("An error occurred:", error);
});
