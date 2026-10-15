import { copyFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";
const gradleWrapper = isWindows ? "gradlew.bat" : "./gradlew";

function run(command, args, cwd) {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}

run(npmCommand, ["run", "android:sync"], projectRoot);
run(gradleWrapper, ["assembleDebug"], path.join(projectRoot, "android"));

const apkDirectory = path.join(projectRoot, "downloads");
await mkdir(apkDirectory, { recursive: true });
await copyFile(
  path.join(projectRoot, "android", "app", "build", "outputs", "apk", "debug", "app-debug.apk"),
  path.join(apkDirectory, "umoja-sacco.apk"),
);
console.log(`Installable APK created at ${path.join(apkDirectory, "umoja-sacco.apk")}`);
