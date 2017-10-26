const fs = require('fs');
const {join} = require('path');

const git = fs.readFileSync(join(__dirname, '.gitignore'), 'utf8').trim();

const npm = git + `\n${['/generate-npmignore.js', '/src/'].join("\n")}\n`;

fs.writeFileSync(join(__dirname, '.npmignore'), npm);