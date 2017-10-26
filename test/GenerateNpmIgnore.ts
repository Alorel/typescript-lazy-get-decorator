import test from 'ava';
import {access, readFile, unlink} from 'fs';
import {basename, join, resolve} from "path";

let rootPath: string, npmPath: string, gitignorePath: string;

test.before.cb('Prepare', t => {
  rootPath = resolve(__dirname, '..');
  npmPath = join(rootPath, '.npmignore');
  gitignorePath = join(rootPath, '.gitignore');

  unlink(npmPath, () => {
    t.end();

    require('../script/generate-npmignore.js');
  })
});

const exists = (name: string) => {
  test.cb(`${basename(name)} exists`, t => {
    access(join(rootPath, name), (e: Error) => {
      t.falsy(e);
      t.end();
    });
  });
};

exists('.gitignore');
exists('.npmignore');

test('Contents', async t => {
  const rfp = (path: string): Promise<string> => new Promise((resolve, reject) => {
    readFile(path, 'utf8', (e: Error, d: string) => {
      if (e) {
        reject(e);
      } else {
        resolve(d);
      }
    });
  });

  const $git = rfp(gitignorePath);
  const $npm = rfp(npmPath);

  t.is(await $npm, (await $git).trim() + `\n${['/script/generate-npmignore.js', '/src/'].join("\n")}\n`)
});
