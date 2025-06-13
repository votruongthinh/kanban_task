import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import RenameModal from "./RenameModal";

// Mock Modal để render title prop
// Mock Modal để render title prop
vi.mock("../UI/Modal", () => ({
  __esModule: true,
  default: ({ children, title }) => (
    <div>
      <div>{title}</div>
      <div>{children}</div>
    </div>
  ),
}));

// Mock Input
vi.mock("../UI/Input", () => ({
  __esModule: true,
  default: (props) => <input {...props} />,
}));

// SỬA MOCK store ĐÚNG CÁCH
const updateBoard = vi.fn();
const boards = [
  { id: 1, name: "Board 1" },
  { id: 2, name: "Board 2" },
];
vi.mock("../../store/boardStore.js", () => ({
  useBoardStore: (selector) =>
    selector ? selector({ boards, updateBoard }) : { boards, updateBoard },
}));

describe("RenameModal", () => {
  const onClose = vi.fn();
  const board = { id: 2, name: "Board 2" };

  beforeEach(() => {
    updateBoard.mockClear();
    onClose.mockClear();
  });

  it("hiển thị tiêu đề và input với giá trị mặc định", () => {
    render(<RenameModal isOpen={true} onClose={onClose} board={board} />);
    expect(screen.getByText(/Đổi tên board/i)).toBeInTheDocument();
    const input = screen.getByPlaceholderText(/Nhập tên mới/i);
    expect(input.value).toBe("Board 2");
  });

  it("hiển thị lỗi khi submit rỗng", async () => {
    render(<RenameModal isOpen={true} onClose={onClose} board={board} />);
    const input = screen.getByPlaceholderText(/Nhập tên mới/i);
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(screen.getByTestId("submit-rename-btn"));
    expect(
      await screen.findByText(/Tên board là bắt buộc/i)
    ).toBeInTheDocument();
    expect(updateBoard).not.toHaveBeenCalled();
  });

  it("hiển thị lỗi khi tên board bị trùng", () => {
    render(<RenameModal isOpen={true} onClose={onClose} board={board} />);
    const input = screen.getByPlaceholderText(/Nhập tên mới/i);
    fireEvent.change(input, { target: { value: "Board 1" } });
    fireEvent.click(screen.getByTestId("submit-rename-btn"));
    expect(screen.getByText(/đã tồn tại/i)).toBeInTheDocument();
    expect(updateBoard).not.toHaveBeenCalled();
  });

  it("gọi onClose khi bấm Hủy", () => {
    render(<RenameModal isOpen={true} onClose={onClose} board={board} />);
    fireEvent.click(screen.getByTestId("cancel-rename-btn"));
    expect(onClose).toHaveBeenCalled();
    expect(updateBoard).not.toHaveBeenCalled();
  });
});
