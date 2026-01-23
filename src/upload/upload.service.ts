import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { FILE_CONFIG, MESSAGES } from '../common/constants/messages';

@Injectable()
export class UploadService {
  private uploadDir = FILE_CONFIG.UPLOAD_DIR;

  constructor() {
    this.ensureUploadDirSync();
  }

  private ensureUploadDirSync() {
    try {
      const fs = require('fs');
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
    } catch (error) {
      console.log('Upload papkasini yaratishda xato:', error);
    }
  }

  getMulterConfig() {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, this.uploadDir);
        },
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
      limits: {
        fileSize: FILE_CONFIG.MAX_FILE_SIZE,
      },
    };
  }

  getFileUrl(filename: string): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    return `${baseUrl}/uploads/${filename}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      if (filePath) {
        const fileName = filePath.split('/').pop();
        if (fileName) {
          const fullPath = join(this.uploadDir, fileName);
          await unlink(fullPath);
        }
      }
    } catch (error) {
      console.log('File o\'chirishda xato:', error);
    }
  }
}
