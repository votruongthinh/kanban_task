# 📝 Kanban Task App

Ứng dụng quản lý công việc dạng Kanban với các tính năng:

- Quản lý board, task (thêm/sửa/xóa)
- Lưu trạng thái bằng localStorage
- UI hiện đại với TailwindCSS
- State management bằng Zustand
- thay đổi background với dark/light
- di chuyển task qua lại

## 🚀 Cách chạy dự án

### 1. Clone source về máy:

git clone https://github.com/votruongthinh/kanban_task_app.git
cd kanban_task_app

### 2. Cài đặt thư viện

yarn

### 3. (Tùy chọn) Tạo file `.env` nếu dự án có sử dụng biến môi trường

> Nếu dự án sử dụng biến môi trường, hãy tạo file `.env` và điền các biến cần thiết theo hướng dẫn trong tài liệu dự án.

### 4. Chạy dự án

yarn run dev

```
Ứng dụng sẽ chạy tại: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Cài đặt & chạy test với Vitest

### 5. Cài các package cần thiết cho test:

yarn add -D vitest @testing-library/react @testing-library/jest-dom jsdom


### 6. Tạo file `vitest.config.js` ở thư mục gốc:

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.js'
  },
});


### 7. Tạo file `setupTests.js` ở thư mục gốc:
import '@testing-library/jest-dom';


### 8. Chạy test:

yarn test
```

## 💡 Lưu ý

- Khi test component sử dụng Zustand hoặc các store, hãy mock store đúng kiểu dữ liệu.
- Sử dụng các file test mẫu trong `/src` để tham khảo cách viết test component, store, utils...
- Khi test UI có text tiếng Việt, nên dùng matcher linh hoạt (regex, includes).

---

Chúc bạn code vui vẻ! 🚀
