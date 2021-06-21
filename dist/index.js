"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var globby_1 = require("globby");
var yaml_1 = require("yaml");
var lodash_merge_1 = require("lodash.merge");
/**
 * 获取yaml数据
 * @param configDir 配置文件所在目录
 * @param options
 * @returns
 */
function getEnvData(configDir, options) {
    var version = "";
    try {
        version = process.env.npm_package_version || "";
    }
    catch (e) {
        console.error(e);
    }
    var cwd = configDir, globConfig = {
        cwd: cwd,
        root: "/",
    }, PRJ_ENV = process.env.PRJ_ENV || process.env.NODE_ENV || "production", defaultEnvPath = globby_1.default.sync(options.defaultFileName + ".*(yaml|yml)", globConfig)[0] || "";
    if (!defaultEnvPath) {
        throw new Error("config dir must include default.yml or default.yaml");
    }
    var defaultEnv = parseData(defaultEnvPath, cwd), envFile = globby_1.default.sync(((options.files && options.files[0]) || "production") + ".*(yaml|yml)", globConfig)[0] || "", env = parseData(envFile, cwd), envMergeData = lodash_merge_1.default({
        PRJ_ENV: PRJ_ENV,
        VERSION: version,
    }, defaultEnv, env);
    function parseData(url, envDataCwd) {
        if (url === void 0) { url = ""; }
        if (envDataCwd === void 0) { envDataCwd = process.cwd(); }
        if (!url) {
            return {};
        }
        return yaml_1.default.parse(fs_1.default.readFileSync(path_1.default.join(envDataCwd, url || ""), "utf8"));
    }
    return JSON.stringify(envMergeData);
}
exports.default = getEnvData;
//# sourceMappingURL=index.js.map