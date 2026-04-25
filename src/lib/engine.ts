import { mockUsers, mockProducts, mockOrders } from '../data/mockData';
import { DatabaseState, QueryResult, TableName } from '../types';

/**
 * A simplified SQL simulator that simulates table scans vs index seeks.
 * It doesn't actually parse SQL with a full parser (to keep it light),
 * but it interprets the "intent" for the learning platform.
 */
export class SQLSimulator {
  private state: DatabaseState;

  constructor() {
    this.state = {
      users: mockUsers,
      products: mockProducts,
      orders: mockOrders,
      indexes: {
        users: ['id'], // Primary keys always indexed
        products: ['id'],
        orders: ['id'],
      },
    };
  }

  addIndex(tableName: TableName, column: string) {
    if (!this.state.indexes[tableName].includes(column)) {
      this.state.indexes[tableName].push(column);
    }
  }

  removeIndex(tableName: TableName, column: string) {
    this.state.indexes[tableName] = this.state.indexes[tableName].filter(c => c !== column);
  }

  getIndexes(tableName: TableName) {
    return this.state.indexes[tableName];
  }

  /**
   * Simulates a SELECT * FROM table WHERE column = value
   */
  executeQuery(tableName: TableName, column: string, value: any, operator: '=' | '>' | '<' | 'LIKE' = '='): QueryResult {
    const table = this.state[tableName];
    const isIndexed = this.state.indexes[tableName].includes(column);
    
    const startTime = performance.now();
    let data: any[] = [];
    let rowsScanned = 0;

    if (isIndexed && operator === '=') {
      // INDEX SEEK Simulation
      // In real life, complexity is O(log N)
      // Here we simulate it by only "scanning" a handful of rows
      rowsScanned = Math.ceil(Math.log2(table.length)) + 1;
      data = table.filter(row => row[column] == value);
    } else {
      // FULL TABLE SCAN Simulation
      // Complexity is O(N)
      rowsScanned = table.length;
      data = table.filter(row => {
        const rowVal = row[column];
        if (operator === '=') return rowVal == value;
        if (operator === '>') return rowVal > value;
        if (operator === '<') return rowVal < value;
        if (operator === 'LIKE') return String(rowVal).toLowerCase().includes(String(value).toLowerCase());
        return false;
      });
    }

    const endTime = performance.now();
    const executionTimeMs = (endTime - startTime) + (rowsScanned * 0.001); // Artificial penalty based on scan size

    return {
      data: data.slice(0, 100), // Trả về mẫu
      executionTimeMs,
      rowsScanned,
      usedIndex: isIndexed && operator === '=',
      explanation: isIndexed && operator === '='
        ? `Index Seek trên ${tableName}(${column}) đã được sử dụng. Cơ sở dữ liệu đã nhảy trực tiếp đến các bản ghi khớp.`
        : `Full Table Scan trên ${tableName}. Cơ sở dữ liệu đã phải kiểm tra mọi dòng (Tổng cộng: ${table.length}) vì không tìm thấy chỉ mục (index) phù hợp.`,
    };
  }

  getTable(tableName: TableName) {
    return this.state[tableName];
  }
}

export const dbSimulator = new SQLSimulator();
