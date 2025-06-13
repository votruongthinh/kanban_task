import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import DeleteModal from "./DeleteModal";

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

// Mock store
const deleteBoard = vi.fn();
vi.mock("../../store/boardStore.js", () => ({
  useBoardStore: () => ({
    deleteBoard,
    boards: [{ id: 1, name: "Board 1" }],
  }),
}));

describe("DeleteModal", () => {
  const onClose = vi.fn();
  const board = { id: 1, name: "Board 1" };

  beforeEach(() => {
    deleteBoard.mockClear();
    onClose.mockClear();
  });

  it("hiển thị tiêu đề modal với tên board", () => {
    render(<DeleteModal isOpen={true} onClose={onClose} board={board} />);
    expect(screen.getByText(/Xóa Board: Board 1/i)).toBeInTheDocument();
  });

  it("hiển thị hướng dẫn xác nhận", () => {
    render(<DeleteModal isOpen={true} onClose={onClose} board={board} />);
    expect(screen.getByText(/vui lòng nhập/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
  });

  it("không gọi deleteBoard nếu xác nhận sai", async () => {
    render(<DeleteModal isOpen={true} onClose={onClose} board={board} />);
    const input = screen.getByPlaceholderText(/vui lòng nhập 'delete'/i);
    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.click(screen.getByTestId("submit-delete-btn"));
    expect(await screen.findByText(/vui lòng nhập đúng/i)).toBeInTheDocument();
    expect(deleteBoard).not.toHaveBeenCalled();
  });

  it("reset và gọi onClose khi bấm nút Hủy", () => {
    render(<DeleteModal isOpen={true} onClose={onClose} board={board} />);
    fireEvent.click(screen.getByTestId("cancel-delete-btn"));
    expect(onClose).toHaveBeenCalled();
    expect(deleteBoard).not.toHaveBeenCalled();
  });
});
