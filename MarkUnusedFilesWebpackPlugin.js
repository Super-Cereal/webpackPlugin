// A JavaScript class.
const fs = require("fs");
const promisify = require("util.promisify");
const path = require("path");
const nativeGlobAll = require("glob-all");

const writeFileAsync = promisify(fs.writeFile);

function getAllFilePaths({ folderPath, ignoreSet }) {
  let allFileNames, filePath, stat;
  const folders = [folderPath];
  const result = new Map();

  while (folders.length) {
    folderPath = folders.pop();
    allFileNames = nativeGlobAll.sync([`${folderPath}/*`, ...ignoreSet], {
      root: __dirname,
      nosort: true,
    });
    for (filePath of allFileNames) {
      stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        folders.push(filePath);
      } else {
        result.set(path.normalize(filePath), !0);
      }
    }
  }
  return result;
}

class MarkUnusedFilesWebpackPlugin {
  constructor({ ignorePatterns = [] }) {
    ignorePatterns = ignorePatterns.map((p) => "!" + p);
    const ignoreSet = new Set(ignorePatterns);
    ignoreSet.add("!/**/node_modules");
    ignoreSet.add("!/package.json");
    ignoreSet.add("!/package-lock.json");
    ignoreSet.add("!/webpack.config.js");
    this.options = { ignoreSet };
  }
  apply(compiler) {
    this.options.ignoreSet.add(`!${compiler.options.output.path}`);

    const allFilePathsMap = getAllFilePaths({ folderPath: __dirname, ...this.options });
    compiler.hooks.normalModuleFactory.tap("Mark unused files webpack plugin", (normalModuleFactory) => {
      normalModuleFactory.hooks.module.tap("Mark unused files webpack plugin", (_, createData) => {
        allFilePathsMap.set(path.normalize(createData.resource), !1);
      });
    });

    compiler.hooks.emit.tap("Mark unused files webpack plugin", () => {
      const results = [];
      for (let [filePath, isNotUsed] of allFilePathsMap) {
        if (isNotUsed) results.push(path.relative(__dirname, filePath));
      }
      writeFileAsync(`${compiler.options.output.path}/unused.json`, JSON.stringify(results));
    });
  }
}

module.exports = MarkUnusedFilesWebpackPlugin;
