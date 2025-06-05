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
    }),
    { name: "task-storage" }
  )
);
