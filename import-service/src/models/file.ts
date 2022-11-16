export interface UploadedFile extends Record<string, unknown> {
    name: string;
    size: number;
    type: string;
  }
  