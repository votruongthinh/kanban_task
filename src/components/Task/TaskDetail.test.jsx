import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import TaskDetail from "./TaskDetail";

// Mock Modal component
vi.mock("../UI/Modal", () => ({
  default: ({ children, title, onClose }) => (
    <div data-testid="modal">
      <div data-testid="modal-title">{title}</div>
      <button data-testid="modal-close" onClick={onClose}>
        Đóng
      </button>
      {children}
    </div>
  ),
}));

// Mock zustand store
const mockUpdateTask = vi.fn();
vi.mock("../../store/taskStore.js", () => ({
  useTaskStore: () => ({
    updateTask: mockUpdateTask,
  }),
}));

describe("TaskDetail", () => {
  const baseTask = {
    id: 7,
    title: "Task A",
    description: "Mô tả task A",
    status: "toDo",
    priority: "Trung Bình",
    dueDate: "2025-06-30",
    subtasks: [
      { id: 1, title: "Subtask 1", completed: false },
      { id: 2, title: "Subtask 2", completed: true },
    ],
  };

  beforeEach(() => {
    mockUpdateTask.mockClear();
  });

  it("hiển thị đầy đủ thông tin task", () => {
    render(<TaskDetail task={baseTask} onClose={() => {}} />);
    expect(screen.getByTestId("modal-title").textContent).toMatch(
      /Chi tiết Nhiệm vụ/i
    );
    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.getByText("Mô tả task A")).toBeInTheDocument();
    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("Trung Bình")).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("2025"))
    ).toBeInTheDocument();
    // Note: toLocaleDateString may vary by locale
    expect(screen.getByText("Subtask 1")).toBeInTheDocument();
    expect(screen.getByText("Subtask 2")).toBeInTheDocument();
  });

  it("hiển thị đúng số lượng subtasks hoàn thành và phần trăm", () => {
    render(<TaskDetail task={baseTask} onClose={() => {}} />);
    expect(screen.getByText("1/2 nhiệm vụ con hoàn thành")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("hiển thị không có subtasks khi mảng subtasks rỗng", () => {
    const taskNoSub = { ...baseTask, subtasks: [] };
    render(<TaskDetail task={taskNoSub} onClose={() => {}} />);
    expect(screen.getByText(/Không có nhiệm vụ con/i)).toBeInTheDocument();
  });

  it("toggle hoàn thành subtask gọi updateTask với dữ liệu đúng", () => {
    render(<TaskDetail task={baseTask} onClose={() => {}} />);
    // Subtask 1 chưa hoàn thành, click sẽ thành hoàn thành
    const checkbox = screen.getByTestId("subtask-checkbox-1");
    fireEvent.click(checkbox);
    expect(mockUpdateTask).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        subtasks: [
          { id: 1, title: "Subtask 1", completed: true },
          { id: 2, title: "Subtask 2", completed: true },
        ],
      })
    );
  });

  it("toggle bỏ hoàn thành subtask gọi updateTask với dữ liệu đúng", () => {
    render(<TaskDetail task={baseTask} onClose={() => {}} />);
    // Subtask 2 đã hoàn thành, click sẽ thành chưa hoàn thành
    const checkbox = screen.getByTestId("subtask-checkbox-2");
    fireEvent.click(checkbox);
    expect(mockUpdateTask).toHaveBeenCalledWith(
      7,
      expect.objectContaining({
        subtasks: [
          { id: 1, title: "Subtask 1", completed: false },
          { id: 2, title: "Subtask 2", completed: false },
        ],
      })
    );
  });

  it('gọi onClose khi click nút "Đóng" trong modal', () => {
    const onClose = vi.fn();
    render(<TaskDetail task={baseTask} onClose={onClose} />);
    fireEvent.click(screen.getByTestId("close-detail"));
    expect(onClose).toHaveBeenCalled();
  });

  it("hiển thị đúng khi không có mô tả hoặc ngày hết hạn", () => {
    const taskNoDescNoDue = { ...baseTask, description: "", dueDate: "" };
    render(<TaskDetail task={taskNoDescNoDue} onClose={() => {}} />);
    expect(screen.getByText("Không có mô tả")).toBeInTheDocument();
    expect(screen.getByText("Không có ngày hết hạn")).toBeInTheDocument();
  });
});
