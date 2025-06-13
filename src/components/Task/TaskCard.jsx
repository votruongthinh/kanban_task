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

  // Tính tiến độ subtasks
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((sub) => sub.completed).length || 0;
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <div
      data-testid="task-card"
      className="p-2 bg-lightCard dark:bg-darkCard rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow mb-2 relative"
      onClick={(e) => {
        if (typeof onTaskClick === "function" && !e.target.closest("button"))
          onTaskClick(task);
      }}
    >
      <div className="flex justify-between items-center">
        <h3
          data-testid="task-card-title"
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
            data-testid="task-card-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none rounded-full transition duration-200 ease-in-out"
          >
            ☰
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
              <button
                data-testid="task-card-edit-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask(task);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                Chỉnh sửa
              </button>
              <button
                data-testid="task-card-delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof onDeleteTask === "function") {
                    onDeleteTask(task);
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
      {totalSubtasks > 0 && (
        <>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {completedSubtasks}/{totalSubtasks} nhiệm vụ con
          </p>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
            <div
              className="bg-green-400 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
