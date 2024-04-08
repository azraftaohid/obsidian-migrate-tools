import { Dirent } from "fs";
import fsp from "fs/promises";
import path, { sep } from "path";
import sanitize from "sanitize-filename";
import { utimes } from "utimes";
import { config } from "./config";

async function updateBirthTime(file: Dirent, absPath: string, publicName: string) {
	const content = await fsp.readFile(absPath).then(v => v.toString());
	const props = extractProperties(content);

	const timestamp = props && getProperty(props, "created");
	if (!timestamp) return console.warn("Property 'created' not defined for the file:", publicName);

	const timestampMs = Date.parse(timestamp.startsWith('"') ? timestamp.slice(1, -1) : timestamp);
	if (Number.isNaN(timestampMs)) return console.warn("Can't parse create timestamp for the file:", publicName);

	try {
		await utimes(absPath, { btime: timestampMs, mtime: timestampMs });
	} catch (error) {
		console.error("Unable to update birth time for file (" + publicName + "):", error);
	}
}

async function applyTitleAsName(file: Dirent, absPath: string, publicName: string) {
	const content = await fsp.readFile(absPath).then(v => v.toString());
	const props = extractProperties(content);

	let title = props && getProperty(props, "title");
	if (!title) return console.warn("Property 'title' not defined for file:", publicName);
	
	const name = sanitize(title, { replacement: " " });
	try {
		await fsp.rename(absPath, path.resolve(file.path, name + ".md"));
	} catch (error) {
		console.error(`Unable to rename file (${publicName}): `, error);
	}
}

async function applyParentName(file: Dirent, absPath: string, publicName: string) {
	const parentName = file.path.slice(file.path.lastIndexOf(sep) + 1);
	const adjustedName = parentName.replace(/^\d* /i, "");
	
	try {
		// folders containing multiple .md files may delete all but one
		// which is fine because onenote_export tool exports single .md file per folder
		await fsp.rename(absPath, path.resolve(file.path, adjustedName + ".md"));
	} catch (error) {
		console.error(`Unable to rename file (${publicName}): `, error);
	}
}

async function forEachMarkdown(rootDir: string, op: (file: Dirent, absPath: string, publicName: string) => Promise<unknown>) {
	const root = path.resolve(rootDir);
	const contents = await fsp.readdir(root, { recursive: true, withFileTypes: true });
	
	for (const content of contents) {
		if (!content.isFile() || !content.name.endsWith(".md")) continue;

		const absPath = path.resolve(content.path, content.name);
		const publicName = absPath.slice(root.length + 1);

		await op(content, absPath, publicName);
	}
}

function extractProperties(src: string) {
	return /---[\s\S]*---/i.exec(src)?.[0];
}

function getProperty(props: string, name: string) {
	const prop = new RegExp(`${name}: "?.+"?`, "i").exec(props)?.[0];
	if (!prop) return;

	const value = prop.slice(name.length + 2);
	return value.startsWith('"') ? value.slice(1, -1) : value;
}

forEachMarkdown(config.workingDir, updateBirthTime).then(() => {
	console.log("Completed.");
}).catch(error => {
	console.error("An error occurred:", error);
});
