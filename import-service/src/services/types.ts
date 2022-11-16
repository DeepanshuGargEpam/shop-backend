import { UploadedFile } from '../models/file';

export interface Service {
  getSignedUrl(fileName: string): Promise<string>;
  importFile(file: UploadedFile): Promise<unknown>;
  parseFile(key: string): Promise<unknown>;
}
