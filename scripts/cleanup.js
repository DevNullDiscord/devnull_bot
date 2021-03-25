const fs = require("fs");
const _p = require("util").promisify;
const Path = require("path");
const rm = _p(fs.rm);

const buildPath = Path.resolve(process.cwd(), "build");

rm(buildPath, { recursive: true, force: true }).catch((e) => {
  throw e;
});
