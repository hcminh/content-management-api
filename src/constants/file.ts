import { join } from 'path';
export const FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ROOT_PATH = process.env.INIT_CWD;
export const UPLOAD_FOLDER = 'uploads';
export const UPLOAD_PATH = join(ROOT_PATH, UPLOAD_FOLDER);
