import { useUiStore } from "../../store/uiStore";
import BoardList from "../Sidebar/BoardList";
import ThemeToggle from "../Task/ThemeToggle";

const Sidebar = ({ onOpenBoardModal }) => {
  const { toggleSidebar, isSidebarVisible } = useUiStore();

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-64 h-screen
    bg-white dark:bg-darkCard 
    border-r border-gray-200 dark:border-gray-700 
    flex flex-col transform transition-transform duration-300
    ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"}
  `;

  return (
    <div className={sidebarClasses} aria-label="Sidebar">
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <img src="/vite.svg" alt="Kanban Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
            Kanban DashBoard
          </span>
        </div>
      </div>

      <BoardList onOpenBoardModal={onOpenBoardModal} />

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <ThemeToggle />
        <button
          onClick={toggleSidebar}
          className="mt-2 w-full text-center text-gray-600 dark:text-gray-300 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Đóng Sidebar
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
