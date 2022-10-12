export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    image?: string;
    category?: string;
  }
  
  export interface AvailableProduct extends Product {
    id: string;
    title: string;
    description: string;
    price: number;
    image?: string;
    category?: string;
    count: number;
  }