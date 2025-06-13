import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AddTaskModal from "./AddTaskModal";

// Mock store
vi.mock("../../store/taskStore.js", () => ({
  useTaskStore: () => ({
    addTask: vi.fn(),
    updateTask: vi.fn(),
  }),
}));
vi.mock("../../store/boardStore.js", () => ({
  useBoardStore: () => ({
    currentBoard: { id: "b1", name: "Board 1" },
  }),
}));

// Mock UI
vi.mock("../UI/Modal", () => ({
  default: ({ children, title, onClose }) => (
    <div data-testid="modal">
      <div data-testid="modal-title">{title}</div>
      <button data-testid="close" onClick={onClose}>
        Đóng
      </button>
      {children}
    </div>
  ),
}));
vi.mock("../UI/Input", () => ({
  __esModule: true,
  default: (props) => <input {...props} />,
}));

// Mock TaskDetail
vi.mock("./TaskDetail", () => ({
  default: ({ task, onClose }) => (
    <div data-testid="task-detail">
      <span>{task?.title || "No task"}</span>
      <button onClick={onClose}>Đóng</button>
    </div>
  ),
}));

describe("AddTaskModal", () => {
  it("hiển thị title tạo khi không có task", () => {
    render(<AddTaskModal onClose={() => {}} />);
    expect(screen.getByTestId("modal-title").textContent).toMatch(
      /Tạo Nhiệm vụ/i
    );
  });

  it("hiển thị title chỉnh sửa khi có task", () => {
    render(
      <AddTaskModal
        task={{
          id: 1,
          title: "Task 1",
          status: "toDo",
          priority: "Thấp",
          dueDate: "2025-06-13",
        }}
        onClose={() => {}}
      />
    );
    expect(screen.getByTestId("modal-title").textContent).toMatch(
      /Chỉnh sửa Nhiệm vụ/i
    );
  });

  it("báo lỗi nếu thiếu tiêu đề", async () => {
    render(<AddTaskModal onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText("Tiêu đề task"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByLabelText("Ngày hết hạn"), {
      target: { value: "2025-06-14" },
    });
    fireEvent.click(screen.getByText("Tạo"));
    await screen.findByText(/Tiêu đề là bắt buộc/i);
  });

  it("báo lỗi nếu thiếu ngày hết hạn", async () => {
    render(<AddTaskModal onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText("Tiêu đề task"), {
      target: { value: "Test" },
    });
    fireEvent.click(screen.getByText("Tạo"));
    await screen.findByText(/Ngày hết hạn là bắt buộc/i);
  });

  it("thêm và xóa subtask", () => {
    render(<AddTaskModal onClose={() => {}} />);
    const input = screen.getByPlaceholderText(/thêm nhiệm vụ con/i);
    fireEvent.change(input, { target: { value: "Subtask 1" } });
    fireEvent.click(screen.getByText("Thêm"));
    expect(screen.getByText("Subtask 1")).toBeInTheDocument();
    fireEvent.click(screen.getByText("✕"));
    expect(screen.queryByText("Subtask 1")).not.toBeInTheDocument();
  });

  it("gọi onClose khi nhấn Đóng", () => {
    const onClose = vi.fn();
    render(<AddTaskModal onClose={onClose} />);
    fireEvent.click(screen.getByTestId("close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("hiển thị TaskDetail ở chế độ xem", () => {
    render(
      <AddTaskModal
        task={{ id: 2, title: "Task view" }}
        isViewMode
        onClose={() => {}}
      />
    );
    expect(screen.getByTestId("task-detail")).toBeInTheDocument();
    expect(screen.getByText("Task view")).toBeInTheDocument();
  });
});
