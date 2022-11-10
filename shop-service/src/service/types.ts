export interface Service<T> {
    getAll(): Promise<T[]>;
    getOne(id: string): Promise<T>;
    // create(input: Omit<T, 'id'>): Promise<T>;
    notify(subject: string, message: string): Promise<unknown>;
  }
  