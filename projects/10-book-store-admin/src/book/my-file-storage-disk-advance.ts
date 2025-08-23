// storage/advanced-disk-storage.config.ts
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

// 高级磁盘存储配置（按日期分类存储）
const advancedDiskStorageConfig = diskStorage({
  destination: function (req, file, cb) {
    // 获取当前日期
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    // 根据文件类型创建不同的目录
    let subDir = 'others';
    if (file.mimetype.startsWith('image/')) {
      subDir = 'images';
    } else if (file.mimetype.startsWith('video/')) {
      subDir = 'videos';
    } else if (file.mimetype.includes('pdf')) {
      subDir = 'documents';
    }

    // 构建按日期和类型分类的目录路径
    const uploadDir = path.join('uploads', year.toString(), month, day, subDir);

    try {
      // 递归创建目录结构
      fs.mkdirSync(uploadDir, { recursive: true });
    } catch (error) {
      // 如果目录创建失败，返回错误
      console.error('Directory creation error:', error);
    }

    // 返回目录路径
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    // 生成时间戳
    const timestamp = Date.now();

    // 生成短随机字符串
    const randomStr = Math.random().toString(36).substring(2, 8);

    // 获取文件扩展名
    const extension = path.extname(file.originalname);

    // 清理原始文件名（移除特殊字符）
    const cleanOriginalName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_') // 替换特殊字符为下划线
      .replace(/_{2,}/g, '_') // 多个下划线替换为单个
      .replace(/^_|_$/g, ''); // 移除开头和结尾的下划线

    // 构建最终文件名
    const finalFilename = `${timestamp}_${randomStr}_${cleanOriginalName}.${extension}`;

    cb(null, finalFilename);
  },
});

// 导出高级磁盘存储配置
export { advancedDiskStorageConfig };
