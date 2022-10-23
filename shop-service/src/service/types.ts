export interface Service<T> {
    getAll(): Promise<T[]>;
    getOne(id: string): Promise<T>;
  }
  