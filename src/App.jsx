import { useState } from "react";
import { useUiStore } from "./store/uiStore";
import Sidebar from "./components/Sidebar/Sidebar";
import KanbanBoard from "./pages/KanbanBoard";
import BoardModal from "./components/Board/BoardModal";

function App() {
  const isDarkMode = useUiStore((state) => state.isDarkMode);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const isSidebarVisible = useUiStore((state) => state.isSidebarVisible);

  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const handleOpenBoardModal = () => {
    setIsBoardModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark bg-darkBg" : "bg-lightBg"}`}
    >
      <div className="flex h-screen relative overflow-hidden">
        {/* Sidebar */}
        <Sidebar onOpenBoardModal={handleOpenBoardModal} />

        {/* Overlay khi mở sidebar trên mobile */}
        {isSidebarVisible && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          ></div>
        )}

        {/* Content chính */}
        <div
          className={`flex flex-col flex-1 overflow-hidden z-10 transition-all duration-300 ${
            isSidebarVisible ? "ml-64" : "ml-0"
          }`}
        >
          {/* Nút mở Sidebar trên mobile */}
          {!isSidebarVisible && (
            <div className="absolute top-4 left-4 z-50">
              <button
                onClick={toggleSidebar}
                className="text-gray-700 dark:text-gray-200 text-2xl bg-white dark:bg-darkCard p-2 rounded shadow hover:shadow-md"
              >
                ☰
              </button>
            </div>
          )}

          <main className="flex-1 overflow-auto">
            <KanbanBoard />
          </main>
        </div>
      </div>

      {/* Modal tạo/sửa board */}
      <BoardModal
        isOpen={isBoardModalOpen}
        onClose={() => setIsBoardModalOpen(false)}
        board={null}
      />
    </div>
  );
}

export default App;
