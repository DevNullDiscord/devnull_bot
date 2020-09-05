const fs = require("fs");
const _p = require("util").promisify;
const Path = require("path");

const stat = _p(fs.stat);
const readdir = _p(fs.readdir);
const unlink = _p(fs.unlink);
const rmdir = _p(fs.rmdir);

const buildPath = Path.resolve(process.cwd(), "build");

rmdir(buildPath, { recursive: true }).catch((e) => {
  throw e;
});
