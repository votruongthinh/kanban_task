import React, { useState, useEffect } from "react";

const TaskCard = ({ task, onEditTask, onTaskClick, onDeleteTask }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && !e.target.closest(".relative")) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <div
      className="p-2 bg-lightCard dark:bg-darkCard rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow mb-2 relative"
      onClick={(e) => {
        if (typeof onTaskClick === "function" && !e.target.closest("button"))
          onTaskClick(task); // Chỉ gọi onTaskClick nếu không nhấp vào nút
      }}
    >
      <div className="flex justify-between items-center">
        <h3
          className={`font-semibold text-gray-800 dark:text-gray-200 text-sm ${
            task.status === "done"
              ? "line-through text-green-500 dark:text-green-400"
              : ""
          }`}
        >
          {task.title}
        </h3>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Ngăn lan truyền sự kiện
              setIsMenuOpen(!isMenuOpen);
            }}
            className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none rounded-full transition duration-200 ease-in-out"
          >
            ☰
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn lan truyền khi nhấp vào tùy chọn
                  onEditTask(task);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof onDeleteTask === "function") {
                    onDeleteTask(task);
                    console.log("Delete clicked for task:", task);
                  } else {
                    console.log(
                      "onDeleteTask is not a function:",
                      onDeleteTask
                    );
                  }
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>
      {task.subtasks?.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {task.subtasks.filter((sub) => sub.completed).length}/
          {task.subtasks.length} subtasks
        </p>
      )}
    </div>
  );
};

export default TaskCard;
