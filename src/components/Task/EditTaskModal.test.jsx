import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import EditTaskModal from "./EditTaskModal";

// Mock Modal and Input
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
vi.mock("../UI/Input", () => ({
  __esModule: true,
  default: (props) => <input {...props} />,
}));

// Mock zustand stores
const mockUpdateTask = vi.fn();
vi.mock("../../store/taskStore.js", () => ({
  useTaskStore: () => ({
    updateTask: mockUpdateTask,
  }),
}));
vi.mock("../../store/boardStore.js", () => ({
  useBoardStore: () => ({
    currentBoard: { id: "b1", name: "Board 1" },
  }),
}));

describe("EditTaskModal", () => {
  const task = {
    id: 1,
    title: "Task 1",
    status: "toDo",
    priority: "Trung Bình",
    dueDate: "2025-06-13",
    description: "desc",
    subtasks: [
      { id: 1, title: "Sub1", completed: false },
      { id: 2, title: "Sub2", completed: false },
    ],
  };

  beforeEach(() => {
    mockUpdateTask.mockClear();
  });

  it("hiển thị modal khi có task", () => {
    render(<EditTaskModal task={task} onClose={() => {}} />);
    expect(screen.getByTestId("modal-title").textContent).toMatch(
      /Chỉnh Sửa Nhiệm Vụ/i
    );
    expect(screen.getByDisplayValue("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Sub1")).toBeInTheDocument();
    expect(screen.getByText("Sub2")).toBeInTheDocument();
  });

  it("hiển thị lỗi khi không có task", () => {
    render(<EditTaskModal task={null} onClose={() => {}} />);
    expect(
      screen.getByText(/Không tìm thấy nhiệm vụ để chỉnh sửa/i)
    ).toBeInTheDocument();
  });

  it("thêm subtask mới", () => {
    render(<EditTaskModal task={task} onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/thêm nhiệm vụ con/i), {
      target: { value: "Sub3" },
    });
    fireEvent.click(screen.getByText("Thêm"));
    expect(screen.getByText("Sub3")).toBeInTheDocument();
  });

  it("xóa subtask", () => {
    render(<EditTaskModal task={task} onClose={() => {}} />);
    const sub2RemoveBtn = screen.getAllByText("✕")[1];
    fireEvent.click(sub2RemoveBtn);
    expect(screen.queryByText("Sub2")).not.toBeInTheDocument();
  });

  it("sửa subtask", () => {
    render(<EditTaskModal task={task} onClose={() => {}} />);
    const editBtn = screen.getAllByText("Sửa")[0];
    fireEvent.click(editBtn);
    const editInput = screen.getByDisplayValue("Sub1");
    fireEvent.change(editInput, { target: { value: "Sub1 updated" } });
    fireEvent.click(screen.getByTestId("save-subtask-0"));
    expect(screen.getByText("Sub1 updated")).toBeInTheDocument();
  });

  it("báo lỗi tên subtask trùng", () => {
    render(<EditTaskModal task={task} onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/thêm nhiệm vụ con/i), {
      target: { value: "Sub1" },
    });
    fireEvent.click(screen.getByText("Thêm"));
    expect(screen.getByText(/đã tồn tại/i)).toBeInTheDocument();
  });

  it("báo lỗi khi tiêu đề task rỗng", async () => {
    render(<EditTaskModal task={task} onClose={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText("Tiêu đề task"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Lưu"));
    expect(await screen.findByText(/Tiêu đề là bắt buộc/i)).toBeInTheDocument();
  });

  it('gọi onClose khi nhấn "Đóng"', () => {
    const onClose = vi.fn();
    render(<EditTaskModal task={task} onClose={onClose} />);
    fireEvent.click(screen.getByTestId("close-main"));
    expect(onClose).toHaveBeenCalled();
  });
});
