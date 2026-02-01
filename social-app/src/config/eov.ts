/**
 * EOV配置加载器 (EOV Config Loader)
 * ==================================
 * 从.eov文件加载配置，用于统一管理API地址等设置
 * Loads configuration from .eov file for centralized management of API settings
 * 
 * 使用方法 (Usage):
 * 修改项目根目录下的 .eov 文件中的 API_BASE_URL 值即可更新所有API请求地址
 * Modify the API_BASE_URL value in the .eov file in the project root to update all API request addresses
 */

// EOV配置接口 (EOV Config Interface)
export interface EOVConfig {
  API_BASE_URL: string;
  API_VERSION?: string;
  API_TIMEOUT?: number;
}

// 默认配置 - 仅作为后备值 (Default Configuration - fallback only)
// 实际值由.eov文件通过环境变量注入
const DEFAULT_CONFIG: EOVConfig = {
  API_BASE_URL: 'http://localhost:5000',
  API_VERSION: 'v1',
  API_TIMEOUT: 30000,
};

/**
 * 同步加载EOV配置 (用于构建时) (Synchronous load EOV config - for build time)
 * 在Web环境中，配置通过构建时注入环境变量
 * In web environment, config is injected at build time via environment variables
 */
function loadEOVConfigSync(): EOVConfig {
  // 检查环境变量 (Check environment variables)
  // 由 inject-eov.js 脚本在构建前将 .eov 转换为 REACT_APP_* 环境变量
  if (process.env.REACT_APP_API_URL) {
    return {
      ...DEFAULT_CONFIG,
      API_BASE_URL: process.env.REACT_APP_API_URL,
    };
  }

  // 使用默认配置 (Use default config)
  return DEFAULT_CONFIG;
}

// 导出配置 (Export config)
export const eovConfig: EOVConfig = loadEOVConfigSync();

// 导出便捷访问方法 (Export convenience access methods)
export const getApiBaseUrl = (): string => eovConfig.API_BASE_URL;
export const getApiVersion = (): string => eovConfig.API_VERSION || 'v1';
export const getApiTimeout = (): number => eovConfig.API_TIMEOUT || 30000;

// 默认导出 (Default export)
export default eovConfig;
