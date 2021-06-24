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
export default function getEnvData(configDir: string, options: IOptions): any;
export {};
