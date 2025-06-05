import { useState } from "react";
import { useUiStore } from "./store/uiStore";
import Sidebar from "./components/Sidebar/Sidebar";
import KanbanBoard from "./pages/KanbanBoard";
import BoardModal from "./components/Board/BoardModal";

function App() {
  const isDarkMode = useUiStore((state) => state.isDarkMode);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const handleOpenBoardModal = () => {
    setIsBoardModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "dark bg-darkBg" : "bg-lightBg"}`}
    >
      <div className="flex h-screen">
        <Sidebar onOpenBoardModal={handleOpenBoardModal} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto">
            <KanbanBoard />
          </main>
        </div>
      </div>
      <BoardModal
        isOpen={isBoardModalOpen}
        onClose={() => setIsBoardModalOpen(false)}
        board={null}
      />
    </div>
  );
}

export default App;
