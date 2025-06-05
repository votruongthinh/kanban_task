import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTaskStore } from "../../store/taskStore.js";
import { useBoardStore } from "../../store/boardStore.js";
import Modal from "../UI/Modal";
import Input from "../UI/Input";
import { useState } from "react";

// Định nghĩa schema xác thực với Zod
const taskSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().optional(),
  status: z.enum(["toDo", "progress", "done"]),
  priority: z.enum(["Thấp", "Trung Bình", "Cao"]),
  dueDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Ngày hết hạn không hợp lệ",
    }),
  assignee: z.string().optional(),
  subtasks: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        completed: z.boolean(),
      })
    )
    .optional(),
});

const TaskModal = ({ task, onClose, defaultStatus }) => {
  const { addTask, updateTask, deleteTask } = useTaskStore();
  const { currentBoard } = useBoardStore();

  // Khởi tạo form với React Hook Form và Zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || defaultStatus,
      priority: task?.priority || "Trung Bình",
      dueDate: task?.dueDate || "",
      assignee: task?.assignee || "Chưa có thành viên nào được chọn",
      subtasks: task?.subtasks || [],
    },
  });

  const subtasks = watch("subtasks") || [];
  const [newSubtask, setNewSubtask] = useState("");

  const onSubmit = (data) => {
    const taskData = { ...data, boardId: currentBoard?.id };
    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
    }
    onClose();
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtasks = [
        ...(subtasks || []),
        { id: Date.now(), title: newSubtask, completed: false },
      ];
      setValue("subtasks", newSubtasks);
      setNewSubtask("");
    }
  };

  const handleToggleSubtask = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setValue("subtasks", updatedSubtasks);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={task ? "Chỉnh sửa Task" : "Thêm Task"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input {...register("title")} placeholder="Tiêu đề task" />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <textarea
          {...register("description")}
          className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded"
          placeholder="Mô tả"
        />
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Trạng thái
          </label>
          <select
            {...register("status")}
            className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded"
          >
            <option value="toDo">To Do</option>
            <option value="progress">Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Ưu tiên
          </label>
          <select
            {...register("priority")}
            className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded"
          >
            <option value="Thấp">Thấp</option>
            <option value="Trung Bình">Trung Bình</option>
            <option value="Cao">Cao</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Ngày hết hạn
          </label>
          <Input type="date" {...register("dueDate")} />
          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-1">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Subtasks
          </label>
          {subtasks.map((subtask, index) => (
            <div key={subtask.id} className="flex items-center space-x-2 mt-1">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleToggleSubtask(index)}
                className="h-4 w-4 text-primary"
              />
              <span
                className={
                  subtask.completed ? "line-through text-gray-500" : ""
                }
              >
                {subtask.title}
              </span>
            </div>
          ))}
          <div className="flex space-x-2 mt-2">
            <Input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Thêm subtask"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-2 py-1 bg-primary text-white rounded"
            >
              Thêm
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          {task && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Xóa
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded"
          >
            {task ? "Lưu" : "Tạo"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskModal;
