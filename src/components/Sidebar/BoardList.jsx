import { useState, useEffect } from "react";
import { useBoardStore } from "../../store/boardStore.js";
import RenameModal from "../../components/Board/RenameModal";
import DeleteModal from "../../components/Board/DeleteModal";

const BoardList = ({ onOpenBoardModal }) => {
  const { boards, currentBoard, setCurrentBoard } = useBoardStore();
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  const handleSelectBoard = (board) => setCurrentBoard(board);

  const openRenameModal = (board) => {
    setSelectedBoard(board);
    setShowRenameModal(true);
    setShowMenu(null); // Đóng menu khi mở modal
  };

  const openDeleteModal = (board) => {
    setSelectedBoard(board);
    setShowDeleteModal(true);
    setShowMenu(null); // Đóng menu khi mở modal
  };

  const closeModal = () => {
    setShowRenameModal(false);
    setShowDeleteModal(false);
    setSelectedBoard(null);
  };

  const toggleMenu = (boardId) => {
    setShowMenu(showMenu === boardId ? null : boardId);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMenu && !e.target.closest(".menu-container")) {
        setShowMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  return (
    <div className="flex-1 overflow-y-auto">
      <h2 className="text-gray-500 dark:text-gray-400 text-sm font-semibold px-4 mb-2">
        All Boards ({boards.length})
      </h2>
      {boards.map((board) => (
        <div
          key={board.id}
          onClick={() => handleSelectBoard(board)}
          className={`flex items-center justify-between space-x-2 px-4 py-2 cursor-pointer rounded-r-full ${
            currentBoard?.id === board.id
              ? "bg-primary text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <span>{board.name}</span>
          <div className="menu-container relative">
            <button onClick={() => toggleMenu(board.id)}>⋮</button>
            {showMenu === board.id && (
              <div className="absolute right-0 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2">
                <button
                  className="text-green-600 dark:text-green-400 w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => openRenameModal(board)}
                >
                  Rename
                </button>
                <button
                  className="text-red-600 dark:text-red-400 w-full text-left px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => openDeleteModal(board)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      <button
        onClick={() => onOpenBoardModal(null)}
        className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-gray-200 dark:hover:bg-gray-600 rounded-r-full w-full"
      >
        <span>+ Create New Board</span>
      </button>

      {/* Modal riêng cho Rename và Delete */}
      <RenameModal
        isOpen={showRenameModal}
        onClose={closeModal}
        board={selectedBoard}
      />
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={closeModal}
        board={selectedBoard}
      />
    </div>
  );
};

export default BoardList;
