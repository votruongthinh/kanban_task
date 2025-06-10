import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId } from "../utils/generateId.js";

export const useTaskStore = create(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (taskData) =>
        set((state) => {
          const newTask = {
            id: generateId(),
            boardId: taskData.boardId,
            title: taskData.title,
            description: taskData.description || "",
            status: taskData.status || "toDo",
            priority: taskData.priority || "Trung Bình",
            dueDate: taskData.dueDate || "",
            assignee: taskData.assignee || "Chưa có thành viên nào được chọn",
            subtasks: taskData.subtasks || [],
          };
          return { tasks: [...state.tasks, newTask] };
        }),
      updateTask: (taskId, updatedData) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedData } : task
          ),
        })),
      updateTaskStatus: (taskId, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          ),
        })),
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),
      updateTaskOrder: (taskIds, status) =>
        set((state) => {
          const allTasks = [...state.tasks]; // Tạo bản sao để tránh mutating state trực tiếp
          const tasksToReorder = allTasks.filter(
            (task) => task.status === status
          );
          console.log(
            "Tasks to reorder:",
            tasksToReorder.map((t) => t.title)
          );
          console.log("Task IDs received:", taskIds);
          const validTaskIds = taskIds.filter((id) =>
            tasksToReorder.some((task) => task.id === id)
          );
          if (validTaskIds.length === 0) {
            console.warn("No valid task IDs to reorder:", { taskIds, status });
            return { tasks: allTasks };
          }
          const reorderedTasks = validTaskIds.map((id) =>
            tasksToReorder.find((task) => task.id === id)
          );
          const remainingTasks = tasksToReorder.filter(
            (task) => !validTaskIds.includes(task.id)
          );
          const unchangedTasks = allTasks.filter(
            (task) => task.status !== status
          );
          const newTasks = [
            ...reorderedTasks,
            ...remainingTasks,
            ...unchangedTasks,
          ];
          console.log(
            "Reordered tasks for status",
            status,
            ":",
            reorderedTasks.map((t) => t.title)
          );
          console.log(
            "All tasks after reorder:",
            newTasks.map((t) => t.title)
          );
          return { tasks: newTasks };
        }),
    }),
    { name: "task-storage" }
  )
);
