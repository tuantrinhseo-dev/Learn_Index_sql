import { Lesson, Exercise } from '../types';

export const lessons: Lesson[] = [
  {
    id: 'intro',
    title: 'Database Index là gì?',
    content: ` Hãy tưởng tượng một thư viện với hàng ngàn cuốn sách. Nếu bạn muốn tìm cuốn "Số Đỏ", bạn có thể đi bộ qua từng kệ cho đến khi tìm thấy nó (**Full Table Scan**). Hoặc, bạn có thể nhìn vào mục lục thẻ (**Index**) cho bạn biết chính xác nó nằm ở hàng và kệ nào.
    
    Trong cơ sở dữ liệu, một chỉ mục (index) là một cấu trúc dữ liệu (thường là B-Tree) giúp cải thiện tốc độ truy xuất dữ liệu đổi lại phải tốn thêm dung lượng lưu trữ và làm chậm thao tác ghi dữ liệu.`,
    quiz: {
      question: 'Lợi ích chính của chỉ mục cơ sở dữ liệu là gì?',
      options: [
        'Giúp cơ sở dữ liệu chiếm ít dung lượng hơn',
        'Tăng tốc độ truy xuất dữ liệu (câu lệnh SELECT)',
        'Làm cho việc thêm dòng mới nhanh hơn',
        'Tự động sửa dữ liệu bị hỏng'
      ],
      correctIndex: 1,
      explanation: 'Index cung cấp một con đường tắt để cơ sở dữ liệu tìm thấy các dòng cụ thể mà không cần đọc toàn bộ bảng.'
    }
  },
  {
    id: 'how-it-works',
    title: 'Cách thức hoạt động: Scan vs. Seek',
    content: `Khi bạn chạy một truy vấn, Trình tối ưu hóa cơ sở dữ liệu sẽ chọn một con đường:
    
1. **Full Table Scan**: Kiểm tra mọi dòng trong bảng. 
   - Tốt cho bảng nhỏ.
   - Cực kỳ tệ cho bảng hàng triệu dòng.
    
2. **Index Seek**: Sử dụng index để nhảy tới vị trí chính xác.
   - Yêu cầu một index trên cột được sử dụng trong mệnh đề WHERE.
   - Cực kỳ nhanh ngay cả với hàng tỷ dòng.`,
  },
  {
    id: 'types',
    title: 'Các loại Index',
    content: `1. **Single Column**: Index trên một cột duy nhất (VD: email).
2. **Composite**: Index trên nhiều cột (VD: first_name + last_name).
3. **Unique**: Đảm bảo không có hai dòng nào có cùng giá trị (VD: username).
4. **Primary Key**: Được hệ thống tự động đánh chỉ mục.`,
  }
];

export const exercises: Exercise[] = [
  // BASIC
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `basic-${i + 1}`,
    level: 'Cơ bản' as const,
    title: `Tìm kiếm cơ bản #${i + 1}`,
    description: `Tìm người dùng có email 'user_${(i + 1) * 50}@example.com'. Hãy chú ý số lượng dòng bị quét (rows scanned).`,
    targetTable: 'users' as const,
    initialQuery: `SELECT * FROM users WHERE email = 'user_${(i + 1) * 50}@example.com'`,
    winningCriteria: {
      maxRowsScanned: 20,
      requiredIndex: 'email'
    },
    hint: "Hãy thử thêm một index vào cột 'email'.",
    solution: "CREATE INDEX idx_email ON users(email);"
  })),
  // INTERMEDIATE
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `int-${i + 1}`,
    level: 'Trung bình' as const,
    title: `Lọc danh mục #${i + 1}`,
    description: `Lọc các sản phẩm trong danh mục 'Electronics'. Chúng ta có 500 sản phẩm. Hãy làm cho việc này hiệu quả hơn.`,
    targetTable: 'products' as const,
    initialQuery: `SELECT * FROM products WHERE category = 'Electronics'`,
    winningCriteria: {
      maxRowsScanned: 50,
      requiredIndex: 'category'
    },
    hint: "Tạo một index trên cột mà bạn đang dùng để lọc.",
    solution: "CREATE INDEX idx_category ON products(category);"
  })),
  // ADVANCED
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `adv-${i + 1}`,
    level: 'Nâng cao' as const,
    title: `Đồng bộ trạng thái đơn hàng #${i + 1}`,
    description: `Chúng ta có 2000 đơn hàng. Tìm tất cả các đơn hàng 'pending'. Truy vấn này rất quan trọng cho bộ phận vận chuyển.`,
    targetTable: 'orders' as const,
    initialQuery: `SELECT * FROM orders WHERE status = 'pending'`,
    winningCriteria: {
      maxRowsScanned: 50,
      requiredIndex: 'status'
    },
    hint: "Các bảng có dữ liệu lớn như 'orders' cần index trên các trường trạng thái (status) để phục vụ báo cáo.",
    solution: "CREATE INDEX idx_status ON orders(status);"
  }))
];
