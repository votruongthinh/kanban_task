import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "../utils/generateId.js";

export const useBoardStore = create(
  persist(
    (set, get) => ({
      boards: [],
      currentBoard: null,
      addBoard: (boardName) =>
        set((state) => {
          const newBoard = { id: generateId(), name: boardName };
          return { boards: [...state.boards, newBoard] };
        }),
      updateBoard: (boardId, updatedData) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId ? { ...board, ...updatedData } : board
          ),
        })),
      deleteBoard: (boardId) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== boardId),
          currentBoard:
            state.currentBoard?.id === boardId ? null : state.currentBoard,
        })),
      renameBoard: (boardId, newName) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId ? { ...board, name: newName } : board
          ),
          currentBoard:
            state.currentBoard?.id === boardId
              ? { ...state.currentBoard, name: newName }
              : state.currentBoard,
        })),
      setCurrentBoard: (board) => set({ currentBoard: board }),
    }),
    { name: "board-storage" }
  )
);
