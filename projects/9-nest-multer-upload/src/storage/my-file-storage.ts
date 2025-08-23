import * as multer from 'multer';
import * as fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      // 如果目录不存在，则创建目录，如果目录存在，则会报错
      // fs.mkdirSync('uploads');
      // 目录已存在不会报错
      fs.mkdirSync('uploads', { recursive: true });
    } catch (e) {
      console.log(e);
    }

    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;
    cb(null, uniqueSuffix);
  },
});

export { storage };
