import { useState, useEffect } from "react";
import { useBoardStore } from "../store/boardStore.js";
import { useTaskStore } from "../store/taskStore.js";
import { useUiStore } from "../store/uiStore.js";
import DragDropContainer from "../components/DragDrop/DrapDropContainer";
import AddTaskModal from "../components/Task/AddTaskModal.jsx";
import EditTaskModal from "../components/Task/EditTaskModal";
import DeleteTaskModal from "../components/Task/DeleteTaskModal.jsx";

const columns = [
  { id: "1", title: "To Do", status: "toDo" },
  { id: "2", title: "Progress", status: "progress" },
  { id: "3", title: "Done", status: "done" },
];

const KanbanBoard = () => {
  const { currentBoard } = useBoardStore();
  const tasks = useTaskStore((state) => state.tasks); // Subscribe state tasks
  const { deleteTask } = useTaskStore(); // Lấy deleteTask từ store
  const { toggleSidebar, isSidebarVisible } = useUiStore();
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState("toDo");

  useEffect(() => {
    console.log("Tasks updated in KanbanBoard:", tasks);
  }, [tasks]);

  const onDeleteTask = (task) => {
    console.log("onDeleteTask called with task:", task);
    if (!task || !task.id) {
      console.log("Invalid task or task.id:", task);
      return;
    }
    setSelectedTask(task);
    setIsDeleteTaskModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("handleDeleteConfirm called, selectedTask:", selectedTask);
    if (selectedTask && deleteTask) {
      console.log("Calling deleteTask with id:", selectedTask.id);
      console.log(
        "All task IDs before delete:",
        tasks.map((t) => t.id)
      );
      deleteTask(selectedTask.id);
      console.log("Tasks after delete:", tasks); // Kiểm tra state sau xóa
    } else {
      console.log("deleteTask or selectedTask is undefined:", {
        selectedTask,
        deleteTask,
      });
    }
    setIsDeleteTaskModalOpen(false);
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const onEditTask = (task) => {
    setSelectedTask(task);
    setIsEditTaskModalOpen(true);
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
    <div className="p-4 sm:p-6">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">
          {currentBoard.name}
        </h1>
      </div>

      <DragDropContainer
        columns={columns}
        tasks={tasks}
        currentBoardId={currentBoard.id}
        onTaskClick={handleTaskClick}
        onCreateTask={handleCreateTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />

      {isTaskModalOpen && (
        <AddTaskModal
          task={selectedTask}
          onClose={() => setIsTaskModalOpen(false)}
          defaultStatus={defaultStatus}
          isViewMode={!!selectedTask}
        />
      )}
      {isEditTaskModalOpen && (
        <EditTaskModal
          task={selectedTask}
          onClose={() => setIsEditTaskModalOpen(false)}
        />
      )}
      {isDeleteTaskModalOpen && (
        <DeleteTaskModal
          task={selectedTask}
          onClose={() => setIsDeleteTaskModalOpen(false)}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
//
