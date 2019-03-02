import * as fs from 'fs';
import {EOL} from 'os';
import {join} from 'path';

const root = join(__dirname, 'test');

for (const type of ['legacy', 'new', 'typescript']) {
  const path = join(root, `LazyGetter.${type}.js`);
  let contents = fs.readFileSync(path, 'utf8');

  contents = `const TEST_TYPE = '${type}';${EOL}${EOL}${contents}`;

  fs.writeFileSync(path, contents);
}
