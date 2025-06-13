import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import KanbanBoard from "../pages/KanbanBoard"; // Đúng đường dẫn component

// Mock các store zustand
vi.mock("../store/boardStore.js", () => ({
  useBoardStore: () => ({
    currentBoard: { id: "1", name: "My Board" },
  }),
}));
vi.mock("../store/taskStore.js", () => ({
  useTaskStore: vi.fn((selector) =>
    selector
      ? selector({ tasks: [{ id: "t1", title: "Task 1", status: "toDo" }] })
      : {
          tasks: [{ id: "t1", title: "Task 1", status: "toDo" }],
          deleteTask: vi.fn(),
        }
  ),
}));
vi.mock("../store/uiStore.js", () => ({
  useUiStore: () => ({
    toggleSidebar: vi.fn(),
    isSidebarVisible: true,
  }),
}));

// Mock các modal/component con
vi.mock("../components/DragDrop/DrapDropContainer", () => ({
  default: ({ onCreateTask, onTaskClick }) => (
    <div>
      <button onClick={() => onCreateTask("toDo")}>Tạo nhiệm vụ</button>
      <button onClick={() => onTaskClick({ id: "t1", title: "Task 1" })}>
        Xem nhiệm vụ
      </button>
    </div>
  ),
}));
vi.mock("../components/Task/AddTaskModal.jsx", () => ({
  default: ({ onClose }) => (
    <div data-testid="add-task-modal">
      <button onClick={onClose}>Close Add</button>
    </div>
  ),
}));
vi.mock("../components/Task/EditTaskModal", () => ({
  default: ({ onClose }) => (
    <div data-testid="edit-task-modal">
      <button onClick={onClose}>Close Edit</button>
    </div>
  ),
}));
vi.mock("../components/Task/DeleteTaskModal.jsx", () => ({
  default: ({ onClose, onDelete }) => (
    <div data-testid="delete-task-modal">
      <button onClick={onDelete}>Delete Confirm</button>
      <button onClick={onClose}>Close Delete</button>
    </div>
  ),
}));

describe("KanbanBoard", () => {
  it("hiển thị welcome khi chưa có board", () => {
    // Mock lại để currentBoard là null
    vi.doMock("../store/boardStore.js", () => ({
      useBoardStore: () => ({
        currentBoard: null,
      }),
    }));

    // Xóa cache module để mock có hiệu lực
    vi.resetModules();
  });

  it("hiển thị tên board", () => {
    render(<KanbanBoard />);
    expect(screen.getByText("My Board")).toBeInTheDocument();
  });

  it("mở AddTaskModal khi tạo task mới", () => {
    render(<KanbanBoard />);
    fireEvent.click(screen.getByText(/tạo nhiệm vụ/i));
    expect(screen.getByTestId("add-task-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close Add"));
  });

  it("mở AddTaskModal khi xem task", () => {
    render(<KanbanBoard />);
    fireEvent.click(screen.getByText(/xem nhiệm vụ/i));
    expect(screen.getByTestId("add-task-modal")).toBeInTheDocument();
  });
});
