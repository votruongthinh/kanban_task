import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import BoardList from "./BoardList";

// Mock store
const setCurrentBoard = vi.fn();
vi.mock("../../store/boardStore.js", () => ({
  useBoardStore: () => ({
    boards: [
      { id: 1, name: "Board 1" },
      { id: 2, name: "Board 2" },
    ],
    currentBoard: { id: 1, name: "Board 1" },
    setCurrentBoard,
  }),
}));

// Mock RenameModal, DeleteModal
vi.mock("../../components/Board/RenameModal", () => ({
  __esModule: true,
  default: () => <div data-testid="rename-modal" />,
}));
vi.mock("../../components/Board/DeleteModal", () => ({
  __esModule: true,
  default: () => <div data-testid="delete-modal" />,
}));

describe("BoardList", () => {
  const onOpenBoardModal = vi.fn();

  beforeEach(() => {
    setCurrentBoard.mockClear();
    onOpenBoardModal.mockClear();
  });

  it("hiển thị danh sách board và nút tạo mới", () => {
    render(<BoardList onOpenBoardModal={onOpenBoardModal} />);
    expect(screen.getByTestId("board-item-1")).toBeInTheDocument();
    expect(screen.getByTestId("board-item-2")).toBeInTheDocument();
    expect(screen.getByTestId("create-board-btn")).toBeInTheDocument();
    expect(screen.getByText("Tất Cả Các Bảng (2)")).toBeInTheDocument();
  });

  it("click vào board gọi setCurrentBoard", () => {
    render(<BoardList onOpenBoardModal={onOpenBoardModal} />);
    fireEvent.click(screen.getByTestId("board-item-2"));
    expect(setCurrentBoard).toHaveBeenCalledWith({ id: 2, name: "Board 2" });
  });

  it("click nút tạo board mới gọi onOpenBoardModal", () => {
    render(<BoardList onOpenBoardModal={onOpenBoardModal} />);
    fireEvent.click(screen.getByTestId("create-board-btn"));
    expect(onOpenBoardModal).toHaveBeenCalledWith(null);
  });

  it("mở menu và click 'Đổi tên' hiển thị RenameModal", () => {
    render(<BoardList onOpenBoardModal={onOpenBoardModal} />);
    fireEvent.click(screen.getByTestId("board-menu-btn-1"));
    fireEvent.click(screen.getByTestId("rename-btn-1"));
    expect(screen.getByTestId("rename-modal")).toBeInTheDocument();
  });

  it("mở menu và click 'Xóa' hiển thị DeleteModal", () => {
    render(<BoardList onOpenBoardModal={onOpenBoardModal} />);
    fireEvent.click(screen.getByTestId("board-menu-btn-2"));
    fireEvent.click(screen.getByTestId("delete-btn-2"));
    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
  });
});
