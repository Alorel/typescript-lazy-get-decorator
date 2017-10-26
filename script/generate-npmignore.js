const fs = require('fs');
const {join, resolve} = require('path');

const base = resolve(__dirname, '..');
const git = fs.readFileSync(join(base, '.gitignore'), 'utf8').trim();

const npm = git + `\n${['/script/generate-npmignore.js', '/src/'].join("\n")}\n`;

fs.writeFileSync(join(base, '.npmignore'), npm);