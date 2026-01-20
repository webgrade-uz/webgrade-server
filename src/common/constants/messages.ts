export const MESSAGES = {
  // Admin
  ADMIN_NOT_FOUND: 'Admin topilmadi',
  INVALID_PASSWORD: 'Parol noto\'g\'ri',
  LOGIN_SUCCESS: 'Muvaffaqiyatli kirish',
  LOGOUT_SUCCESS: 'Muvaffaqiyatli chiqish',

  // Blog
  BLOG_CREATED: 'Blog yaratildi',
  BLOG_UPDATED: 'Blog o\'zgartirildi',
  BLOG_DELETED: 'Blog o\'chirildi',
  BLOG_NOT_FOUND: 'Blog topilmadi',

  // File
  INVALID_FILE_TYPE: 'Faqat rasm fayllari qabul qilinadi',
  FILE_DELETED: 'Fayl o\'chirildi',
};

export const FILE_CONFIG = {
  UPLOAD_DIR: process.env.NODE_ENV === 'production' ? './uploads' : './uploads',
  ALLOWED_EXTENSIONS: /\.(jpg|jpeg|png|gif)$/,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

export const JWT_CONFIG = {
  EXPIRATION: '24h',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};
