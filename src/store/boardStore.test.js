import { act } from "react-dom/test-utils";
import { useBoardStore } from "./boardStore";

describe("useBoardStore", () => {
  // Đảm bảo store được reset mỗi test
  beforeEach(() => {
    useBoardStore.setState({
      boards: [],
      currentBoard: null,
    });
    // Xóa persisted state trong localStorage (nếu có)
    window.localStorage.removeItem("board-storage");
  });

  it("addBoard thêm board mới", () => {
    act(() => {
      useBoardStore.getState().addBoard("Test Board");
    });
    const boards = useBoardStore.getState().boards;
    expect(boards).toHaveLength(1);
    expect(boards[0].name).toBe("Test Board");
    expect(boards[0].id).toBeTruthy();
  });

  it("updateBoard cập nhật đúng board", () => {
    let boardId = "";
    act(() => {
      useBoardStore.getState().addBoard("Update Me");
      boardId = useBoardStore.getState().boards[0].id;
      useBoardStore.getState().updateBoard(boardId, { name: "Updated" });
    });
    const boards = useBoardStore.getState().boards;
    expect(boards[0].name).toBe("Updated");
  });

  it("deleteBoard xóa đúng board", () => {
    let boardId = "";
    act(() => {
      useBoardStore.getState().addBoard("To Delete");
      boardId = useBoardStore.getState().boards[0].id;
      useBoardStore.getState().deleteBoard(boardId);
    });
    expect(useBoardStore.getState().boards).toHaveLength(0);
  });

  it("renameBoard đổi tên đúng", () => {
    let boardId = "";
    act(() => {
      useBoardStore.getState().addBoard("Old Name");
      boardId = useBoardStore.getState().boards[0].id;
      useBoardStore.getState().renameBoard(boardId, "New Name");
    });
    const boards = useBoardStore.getState().boards;
    expect(boards[0].name).toBe("New Name");
  });

  it("setCurrentBoard đặt currentBoard đúng", () => {
    act(() => {
      useBoardStore.getState().addBoard("Board 1");
      useBoardStore.getState().addBoard("Board 2");
      const board = useBoardStore.getState().boards[1];
      useBoardStore.getState().setCurrentBoard(board);
    });
    expect(useBoardStore.getState().currentBoard.name).toBe("Board 2");
  });

  it("deleteBoard đặt currentBoard về null nếu xóa chính nó", () => {
    let boardId = "";
    act(() => {
      useBoardStore.getState().addBoard("Board 1");
      boardId = useBoardStore.getState().boards[0].id;
      useBoardStore
        .getState()
        .setCurrentBoard(useBoardStore.getState().boards[0]);
      useBoardStore.getState().deleteBoard(boardId);
    });
    expect(useBoardStore.getState().currentBoard).toBe(null);
  });

  it("updateBoard cập nhật currentBoard nếu id trùng", () => {
    let boardId = "";
    act(() => {
      useBoardStore.getState().addBoard("Board 1");
      boardId = useBoardStore.getState().boards[0].id;
      useBoardStore
        .getState()
        .setCurrentBoard(useBoardStore.getState().boards[0]);
      useBoardStore.getState().updateBoard(boardId, { name: "Changed" });
    });
    expect(useBoardStore.getState().currentBoard.name).toBe("Changed");
  });
});
