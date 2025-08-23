// storage/memory-storage.config.ts
import { memoryStorage } from 'multer';

// 定义内存存储配置
const memoryStorageConfig = memoryStorage();

// 导出内存存储配置
export { memoryStorageConfig };
