export interface User {
  id: number;
  username: string;
  email: string;
  age: number;
  city: string;
  country: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
}

export interface Order {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  total_price: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  order_date: string;
}

export type TableName = 'users' | 'products' | 'orders';

export interface DatabaseState {
  users: User[];
  products: Product[];
  orders: Order[];
  indexes: {
    [tableName: string]: string[]; // Array of column names being indexed
  };
}

export interface QueryResult {
  data?: any[];
  executionTimeMs: number;
  rowsScanned?: number;
  usedIndex?: boolean;
  explanation: string;
  success?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Exercise {
  id: string;
  level: 'Basic' | 'Intermediate' | 'Advanced';
  title: string;
  description: string;
  targetTable: TableName;
  initialQuery: string;
  winningCriteria: {
    maxRowsScanned: number;
    requiredIndex?: string;
  };
  hint: string;
  solution: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  challenge: string;
  tables: TableName[];
}
