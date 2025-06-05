import { useState } from "react";
import { useBoardStore } from "../store/boardStore.js";
import { useTaskStore } from "../store/taskStore.js";
import { useUiStore } from "../store/uiStore.js";
import DragDropContainer from "../components/DragDrop/DrapDropContainer";
import TaskModal from "../components/Task/TaskModel";

const columns = [
  { id: "1", title: "To Do", status: "toDo" },
  { id: "2", title: "Progress", status: "progress" },
  { id: "3", title: "Done", status: "done" },
];

const KanbanBoard = () => {
  const { currentBoard } = useBoardStore();
  const { tasks } = useTaskStore();
  const { toggleSidebar, isSidebarVisible } = useUiStore();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("toDo");

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateTask = (status) => {
    setSelectedTask(null);
    setDefaultStatus(status);
    setIsTaskModalOpen(true);
  };

  if (!currentBoard) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Welcome to Kanban
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create a new board to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {currentBoard.name}
        </h1>
        <div className="flex items-center space-x-4">
          {!isSidebarVisible && (
            <button
              onClick={toggleSidebar}
              className="p-2 bg-primary text-white rounded hover:bg-secondary transition"
            >
              Show Sidebar
            </button>
          )}
        </div>
      </div>
      <DragDropContainer
        columns={columns}
        tasks={tasks}
        currentBoardId={currentBoard.id}
        onTaskClick={handleTaskClick}
        onCreateTask={handleCreateTask}
      />
      {isTaskModalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() => setIsTaskModalOpen(false)}
          defaultStatus={defaultStatus}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
