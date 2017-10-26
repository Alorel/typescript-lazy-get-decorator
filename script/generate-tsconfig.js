const base = {
  "compilerOptions": {
    "moduleResolution": "node",
    "target": "es5",
    "module": "es2015",
    "noUnusedLocals": true,
    "sourceMap": true,
    "declaration": false,
    "noImplicitAny": true,
    "newLine": "lf",
    "noFallthroughCasesInSwitch": true,
    "suppressImplicitAnyIndexErrors": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "removeComments": false,
    "importHelpers": true,
    "allowUnreachableCode": false,
    "allowUnusedLabels": false,
    "noImplicitUseStrict": true,
    "stripInternal": true,
    "lib": [
      "ES5",
      "ES6",
      "ES7",
      "ES2015",
      "ES2016",
      "ES2017"
    ]
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
};

const lib = {
  "extends": "./tsconfig.base",
  "compilerOptions": {
    "rootDir": "./src"
  },
  "files": [
    "./src/LazyGetter.ts"
  ]
};

const test = {
  "extends": "./tsconfig.base",
  "compilerOptions": {
    "module": "commonjs",
    "target": "es2015",
    "allowJs": true,
    "noUnusedLocals": false,
    "rootDir": "./test"
  },
  "include": [
    "./test/**/*.ts"
  ]
};

const dist = {
  esm5: {
    "extends": "./tsconfig.lib",
    "compilerOptions": {
      "outDir": "dist/esm5"
    }
  },
  esm2015: {
    "extends": "./tsconfig.lib",
    "compilerOptions": {
      "outDir": "dist/esm2015",
      "target": "es2015"
    }
  },
  es5: {
    "extends": "./tsconfig.lib",
    "compilerOptions": {
      "outDir": "dist/es5",
      "module": "commonjs",
      "declaration": true
    }
  }
};

const {writeFile} = require('fs');
const {resolve, join} = require('path');
const basedir = resolve(__dirname, '..');

const write = (name, json) => new Promise((ok, err) => {
  json = JSON.stringify(json, null, 3) + "\n";

  writeFile(join(basedir, `tsconfig.${name}.json`), json, e => {
    if (e) {
      err(e);
    } else {
      ok();
    }
  });
});

const promises = [
  write('base', base),
  write('lib', lib),
  write('test', test)
];

Object.keys(dist)
  .map(name => {
    return {
      name,
      json: dist[name]
    };
  })
  .forEach(spec => {
    promises.push(write(spec.name, spec.json));
  });

module.exports = {
  base,
  lib,
  test,
  dist,
  promise: Promise.all(promises)
    .catch(e => {
      console.error(e);
      process.exit(1);
    })
};
