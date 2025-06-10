import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTaskStore } from "../../store/taskStore.js";
import { useBoardStore } from "../../store/boardStore.js";
import Modal from "../UI/Modal";
import Input from "../UI/Input";
import { useState } from "react";

// Định nghĩa schema xác thực
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

const EditTaskModal = ({ task, onClose }) => {
  const { updateTask } = useTaskStore();
  const { currentBoard } = useBoardStore();
  const [newSubtask, setNewSubtask] = useState("");

  // Kiểm tra nếu task không tồn tại
  if (!task) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Lỗi">
        <p className="text-red-500">Không tìm thấy nhiệm vụ để chỉnh sửa.</p>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
          >
            Đóng
          </button>
        </div>
      </Modal>
    );
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title || "",
      description: task.description || "",
      status: task.status || "toDo",
      priority: task.priority || "Trung Bình",
      dueDate: task.dueDate || "",
      assignee: task.assignee || "",
      subtasks: task.subtasks || [],
    },
  });

  const subtasks = watch("subtasks") || [];

  const onSubmit = (data) => {
    const taskData = { ...data, boardId: currentBoard?.id };
    updateTask(task.id, taskData); // Sử dụng updateTask với task.id và updatedData
    onClose();
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const newSubtasks = [
        ...subtasks,
        { id: Date.now(), title: newSubtask, completed: false },
      ];
      setValue("subtasks", newSubtasks);
      setNewSubtask("");
    }
  };

  const handleToggleSubtask = (index) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setValue("subtasks", updated);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Chỉnh sửa Nhiệm vụ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 space-y-4"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tiêu đề */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tiêu đề
            </label>
            <Input
              {...register("title")}
              placeholder="Tiêu đề task"
              className="w-full"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Trạng thái */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
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

          {/* Ưu tiên */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
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

          {/* Ngày hết hạn */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Ngày hết hạn
            </label>
            <Input type="date" {...register("dueDate")} className="w-full" />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dueDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Mô tả
          </label>
          <textarea
            {...register("description")}
            className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded"
            placeholder="Mô tả"
          />
        </div>

        {/* Subtasks */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Subtasks
          </label>
          {subtasks.map((sub, idx) => (
            <div key={sub.id} className="flex items-center space-x-2 mt-1">
              <input
                type="checkbox"
                checked={sub.completed}
                onChange={() => handleToggleSubtask(idx)}
              />
              <span
                className={sub.completed ? "line-through text-gray-500" : ""}
              >
                {sub.title}
              </span>
              <button
                type="button"
                onClick={() => {
                  const newSubtasks = subtasks.filter((_, i) => i !== idx);
                  setValue("subtasks", newSubtasks);
                }}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                Xóa
              </button>
            </div>
          ))}

          <div className="flex space-x-2 mt-2">
            <Input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Thêm subtask"
              className="flex-1"
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

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
          >
            Đóng
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Lưu
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
