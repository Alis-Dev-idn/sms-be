const { execSync } = require("child_process");
const fs = require("fs-extra");

const commands = [
    "rimraf ./dist && rimraf ./buildApp",
    "npx tsc --build",
    "pkg --compress GZip --output ./buildApp/sms-be package.json",
    // "rimraf ./dist"
];

commands.forEach(cmd => {
    console.log(`Running: ${cmd}`);
    execSync(cmd, { stdio: "inherit" });
});