import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTaskStore } from "../../store/taskStore.js";
import { useBoardStore } from "../../store/boardStore.js";
import Modal from "../UI/Modal";
import Input from "../UI/Input";
import { useState } from "react";
import TaskDetail from "./TaskDetail";

// Định nghĩa schema xác thực
const taskSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().optional(),
  status: z.enum(["toDo", "progress", "done"]),
  priority: z.enum(["Thấp", "Trung Bình", "Cao"]),
  dueDate: z
    .string()
    .min(1, "Ngày hết hạn là bắt buộc")
    .refine(
      (val) => {
        if (!val) return false;
        const d = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        d.setHours(0, 0, 0, 0);
        return d >= today;
      },
      {
        message: "Ngày hết hạn phải bắt đầu từ hôm nay trở đi",
      }
    ),
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

const AddTaskModal = ({ task, onClose, defaultStatus, isViewMode = false }) => {
  const { addTask, updateTask } = useTaskStore();
  const { currentBoard } = useBoardStore();
  const [newSubtask, setNewSubtask] = useState("");
  const [subtaskError, setSubtaskError] = useState(""); // Thêm state cho lỗi
  const isEditing = !!task && !isViewMode;

  // Nếu ở chế độ xem, sử dụng TaskDetail
  if (isViewMode) {
    if (!task) {
      return (
        <Modal isOpen={true} onClose={onClose} title="Lỗi">
          <p className="text-red-500">Không tìm thấy thông tin nhiệm vụ.</p>
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
    return <TaskDetail task={task} onClose={onClose} />;
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
      title: task?.title || "",
      description: task?.description || "",
      status: task?.status || defaultStatus || "toDo",
      priority: task?.priority || "Trung Bình",
      dueDate: task?.dueDate || "",
      assignee: task?.assignee || "",
      subtasks: task?.subtasks || [],
    },
  });

  const subtasks = watch("subtasks") || [];

  const onSubmit = (data) => {
    const taskData = { ...data, boardId: currentBoard?.id };
    if (isEditing) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    onClose();
  };

  // Sửa: kiểm tra trùng tên subtask
  const handleAddSubtask = () => {
    setSubtaskError("");
    const trimmed = newSubtask.trim();
    if (!trimmed) return;
    if (
      subtasks.some(
        (sub) => sub.title.trim().toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      setSubtaskError("Tên nhiệm vụ con đã tồn tại.");
      return;
    }
    const newSubtasks = [
      ...subtasks,
      { id: Date.now(), title: trimmed, completed: false },
    ];
    setValue("subtasks", newSubtasks);
    setNewSubtask("");
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? "Chỉnh sửa Nhiệm vụ" : "Tạo Nhiệm vụ"}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="off"
      >
        {/* Title */}
        <div>
          <Input {...register("title")} placeholder="Tiêu đề task" />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <textarea
          {...register("description")}
          className="w-full p-2 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded"
          placeholder="Mô tả"
        />

        {/* Status */}
        <div>
          <label className="text-sm dark:text-gray-200">Trạng thái</label>
          <select
            {...register("status")}
            className="w-full p-2 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded"
          >
            <option value="toDo">To Do</option>
            <option value="progress">Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="text-sm dark:text-gray-200">Ưu tiên</label>
          <select
            {...register("priority")}
            className="w-full p-2 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded"
          >
            <option value="Thấp">Thấp</option>
            <option value="Trung Bình">Trung Bình</option>
            <option value="Cao">Cao</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="text-sm dark:text-gray-200">Ngày hết hạn</label>
          <Input type="date" {...register("dueDate")} />
          {errors.dueDate && (
            <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Subtasks */}
        <div>
          <label className="text-sm dark:text-gray-200">Nhiệm vụ con</label>
          <div className="max-h-16 overflow-y-auto border rounded">
            {subtasks.map((sub, idx) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-2 border-b last:border-none"
              >
                {/* Sửa màu chữ cho subtask */}
                <span className="dark:text-gray-200 text-gray-900">
                  {sub.title}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newSubtasks = subtasks.filter((_, i) => i !== idx);
                    setValue("subtasks", newSubtasks);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {/* Hiển thị lỗi trùng tên subtask nếu có */}
          {subtaskError && (
            <p className="text-red-500 text-sm mt-1">{subtaskError}</p>
          )}
          <div className="flex space-x-2 mt-2">
            <Input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Thêm subtask"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSubtask();
              }}
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
            className="px-4 py-2 bg-gray-300 dark:text-gray-200 dark:bg-gray-600 rounded"
          >
            Đóng
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded"
          >
            {isEditing ? "Lưu" : "Tạo"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTaskModal;
