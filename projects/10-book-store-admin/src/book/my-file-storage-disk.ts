import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

// 定义磁盘存储配置
const diskStorageConfig = diskStorage({
  // destination函数：确定文件保存的目录
  destination: function (req, file, cb) {
    // 定义上传目录路径
    const uploadDir = 'uploads';

    try {
      // 尝试创建uploads目录（如果不存在）
      fs.mkdirSync(uploadDir, { recursive: true });
    } catch (e) {
      console.log(e);
      // 忽略目录已存在的错误
      // recursive: true 选项会自动处理已存在的目录
    }

    // 调用回调函数，第一个参数是错误（null表示无错误），第二个参数是目录路径
    cb(null, uploadDir);
  },

  // filename函数：确定保存的文件名
  filename: function (req, file, cb) {
    // 获取当前时间戳
    const timestamp = Date.now();

    // 生成随机数
    const randomNum = Math.round(Math.random() * 1e9);

    // 获取文件扩展名，比如.jpg
    const fileExtension = path.extname(file.originalname);

    // 获取不带扩展名的原始文件名
    const baseName = path.basename(file.originalname, fileExtension);

    // 组合生成唯一文件名：时间戳-随机数-原始文件名.扩展名
    const uniqueFilename = `${timestamp}-${randomNum}-${baseName}${fileExtension}`;

    // 调用回调函数返回文件名
    cb(null, uniqueFilename);
  },
});

// 导出磁盘存储配置
export { diskStorageConfig };
