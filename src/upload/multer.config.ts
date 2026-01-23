import { diskStorage } from 'multer';
import { extname } from 'path';
import { FILE_CONFIG, MESSAGES } from '../common/constants/messages';
import * as fs from 'fs';

const uploadDir = FILE_CONFIG.UPLOAD_DIR;

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const multerConfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
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
