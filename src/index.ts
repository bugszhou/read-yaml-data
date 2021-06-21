import path from "path";
import fs from "fs";
import glob from "globby";
import YAML from "yaml";
import merge from "lodash.merge";

interface IOptions {
  /**
   * 默认配置文件的文件名
   * @example {defaultFileName: 'default'}
   * 默认配置文件是default.yml，那么defaultFileName = 'default'
   */
  defaultFileName?: string;
  /**
   * 需要与defaultFileName配置文件合并的文件名
   */
  files?: string[];
}

/**
 * 获取yaml数据
 * @param configDir 配置文件所在目录
 * @param options
 * @returns
 */
export default function getEnvData(configDir: string, options: IOptions) {
  let version = "";

  try {
    version = process.env.npm_package_version || "";
  } catch (e) {
    console.error(e);
  }

  const cwd = configDir,
    globConfig = {
      cwd,
      root: "/",
    },
    PRJ_ENV = process.env.PRJ_ENV || process.env.NODE_ENV || "production",
    defaultEnvPath =
      glob.sync(`${options.defaultFileName}.*(yaml|yml)`, globConfig)[0] || "";

  if (!defaultEnvPath) {
    throw new Error(`config dir must include default.yml or default.yaml`);
  }

  const defaultEnv = parseData(defaultEnvPath, cwd),
    envFile =
      glob.sync(
        `${(options.files && options.files[0]) || "production"}.*(yaml|yml)`,
        globConfig,
      )[0] || "",
    env = parseData(envFile, cwd),
    envMergeData = merge(
      {
        PRJ_ENV,
        VERSION: version,
      },
      defaultEnv,
      env,
    );

  function parseData(url = "", envDataCwd = process.cwd()) {
    if (!url) {
      return {};
    }
    return YAML.parse(
      fs.readFileSync(path.join(envDataCwd, url || ""), "utf8"),
    );
  }
  return JSON.stringify(envMergeData);
}
