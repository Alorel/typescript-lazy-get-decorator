import test from 'ava';
import {readFile, access, constants} from 'fs';
import {join, resolve} from 'path';
import {get} from 'lodash';

const gen: any = require('../script/generate-tsconfig.js');
const root: string = resolve(__dirname, '..');

test.before('Generate', () => gen.promise);

const createTest = (name:string, jsonPath?: string) => {
  if (!jsonPath) {
    jsonPath = name;
  }
  const filename = `tsconfig.${name}.json`;
  const path = join(root, filename);
  const json = get(gen, jsonPath);

  test(`JSON path for ${jsonPath} exists`, t => t.truthy(json));
  test.cb(`${filename} exists`, t => {
    access(path, constants.F_OK, (e:any) => {
      t.falsy(e);

      t.end();
    });
  });

  test.cb(`${filename} contents match`, t => {
    readFile(path, 'utf8', (err: any, strContents: string) => {
      if (err) {
        t.fail(err.message);
      } else {
        t.is(strContents, JSON.stringify(json, null, 3) + "\n", "Contents match");
      }

      t.end();
    });
  });
};

createTest('base');
createTest('lib');
createTest('test');
createTest('es5', 'dist.es5');
createTest('esm5', 'dist.esm5');
createTest('esm2015', 'dist.esm2015');
