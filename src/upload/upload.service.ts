import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { FILE_CONFIG, MESSAGES } from '../common/constants/messages';

@Injectable()
export class UploadService {
  getMulterConfig() {
    return {
      storage: diskStorage({
        destination: FILE_CONFIG.UPLOAD_DIR,
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(FILE_CONFIG.ALLOWED_EXTENSIONS)) {
          return cb(new Error(MESSAGES.INVALID_FILE_TYPE), false);
        }
        cb(null, true);
      },
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (filePath && filePath.startsWith('/uploads/')) {
        const fileName = filePath.replace('/uploads/', '');
        const fullPath = join(process.cwd(), FILE_CONFIG.UPLOAD_DIR, fileName);
        await unlink(fullPath);
      }
    } catch (error) {
      console.log('File o\'chirishda xato:', error);
    }
  }
}
