import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import BoardModal from "./BoardModal";

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

// Mock store: trả về object với boards là mảng
const addBoard = vi.fn();
const updateBoard = vi.fn();
vi.mock("../../store/boardStore.js", () => ({
  useBoardStore: (selector) =>
    selector
      ? selector({ boards: [], addBoard: vi.fn(), updateBoard: vi.fn() }) // boards là mảng
      : { boards: [], addBoard: vi.fn(), updateBoard: vi.fn() },
}));
describe("BoardModal", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    addBoard.mockClear();
    updateBoard.mockClear();
    onClose.mockClear();
  });

  it("hiện modal với tiêu đề thêm mới khi không có prop board", () => {
    render(<BoardModal isOpen={true} onClose={onClose} />);
    expect(screen.getByText(/Thêm Board mới/i)).toBeInTheDocument();
  });

  it("hiện modal với tiêu đề chỉnh sửa khi có prop board", () => {
    render(
      <BoardModal
        isOpen={true}
        onClose={onClose}
        board={{ id: 2, name: "Board 2" }}
      />
    );
    expect(screen.getByText(/Chỉnh sửa Board/i)).toBeInTheDocument();
  });

  it("hiện lỗi khi submit rỗng", async () => {
    render(<BoardModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByTestId("submit-board-btn"));
    expect(
      await screen.findByText(/Tên board là bắt buộc/i)
    ).toBeInTheDocument();
    expect(addBoard).not.toHaveBeenCalled();
  });

  it("gọi onClose khi bấm nút Hủy", () => {
    render(<BoardModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByTestId("cancel-board-btn"));
    expect(onClose).toHaveBeenCalled();
  });
});
