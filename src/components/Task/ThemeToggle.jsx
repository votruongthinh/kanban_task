import { useUiStore } from "../../store/uiStore";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const isDarkMode = useUiStore((state) => state.isDarkMode);
  const toggleTheme = useUiStore((state) => state.toggleTheme);

  return (
    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded p-2 w-full">
      <button
        onClick={toggleTheme}
        className="w-10 h-5 bg-gray-300 dark:bg-primary rounded-full flex items-center p-1 relative"
      >
        <div
          className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
            isDarkMode ? "translate-x-5" : "translate-x-0"
          }`}
        />
        {isDarkMode ? (
          <FaMoon className="text-gray-700 absolute left-1 text-xs" />
        ) : (
          <FaSun className="text-yellow-500 absolute right-1 text-xs" />
        )}
      </button>
    </div>
  );
};

export default ThemeToggle;
