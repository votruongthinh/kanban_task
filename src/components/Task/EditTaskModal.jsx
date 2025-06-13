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

const EditTaskModal = ({ task, onClose }) => {
  const { updateTask } = useTaskStore();
  const { currentBoard } = useBoardStore();
  const [newSubtask, setNewSubtask] = useState("");
  const [editingSubtaskIndex, setEditingSubtaskIndex] = useState(null);
  const [editingSubtaskValue, setEditingSubtaskValue] = useState("");
  const [subtaskError, setSubtaskError] = useState("");

  // Kiểm tra nếu task không tồn tại
  if (!task) {
    return (
      <Modal isOpen={true} onClose={onClose} title="Lỗi">
        <p className="text-red-500">Không tìm thấy nhiệm vụ để chỉnh sửa.</p>
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

  // Thêm subtask mới
  const handleAddSubtask = () => {
    setSubtaskError("");
    if (!newSubtask.trim()) return;
    if (
      subtasks.some(
        (sub) =>
          sub.title.trim().toLowerCase() === newSubtask.trim().toLowerCase()
      )
    ) {
      setSubtaskError("Tên nhiệm vụ con đã tồn tại.");
      return;
    }
    const newSubtasks = [
      ...subtasks,
      { id: Date.now(), title: newSubtask.trim(), completed: false },
    ];
    setValue("subtasks", newSubtasks);
    setNewSubtask("");
  };

  // Xoá subtask
  const handleRemoveSubtask = (idx) => {
    setSubtaskError("");
    const newSubtasks = subtasks.filter((_, i) => i !== idx);
    setValue("subtasks", newSubtasks);
  };

  // Bắt đầu sửa subtask
  const handleEditSubtask = (idx, value) => {
    setSubtaskError("");
    setEditingSubtaskIndex(idx);
    setEditingSubtaskValue(value);
  };

  // Lưu tên subtask sau khi sửa
  const handleSaveEditSubtask = (idx) => {
    setSubtaskError("");
    if (!editingSubtaskValue.trim()) {
      setSubtaskError("Tên nhiệm vụ con không được để trống.");
      return;
    }
    if (
      subtasks.some(
        (sub, i) =>
          i !== idx &&
          sub.title.trim().toLowerCase() ===
            editingSubtaskValue.trim().toLowerCase()
      )
    ) {
      setSubtaskError("Tên nhiệm vụ con đã tồn tại.");
      return;
    }
    const newSubtasks = subtasks.map((sub, i) =>
      i === idx ? { ...sub, title: editingSubtaskValue.trim() } : sub
    );
    setValue("subtasks", newSubtasks);
    setEditingSubtaskIndex(null);
    setEditingSubtaskValue("");
  };

  // Huỷ sửa subtask
  const handleCancelEditSubtask = () => {
    setEditingSubtaskIndex(null);
    setEditingSubtaskValue("");
    setSubtaskError("");
  };

  const onSubmit = (data) => {
    const taskData = { ...data, boardId: currentBoard?.id };
    updateTask(task.id, taskData);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Chỉnh Sửa Nhiệm Vụ">
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
          <label htmlFor="dueDate" className="text-sm dark:text-gray-200">
            Ngày hết hạn
          </label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
          {errors.dueDate && (
            <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
          )}
        </div>

        {/* Subtasks */}
        <div>
          <label className="text-sm dark:text-gray-200">Nhiệm vụ con</label>
          <div className="max-h-32 overflow-y-auto border rounded">
            {subtasks.map((sub, idx) => (
              <div
                key={sub.id}
                className="dark:text-gray-200 flex items-center justify-between p-2 border-b last:border-none"
              >
                {editingSubtaskIndex === idx ? (
                  <>
                    <input
                      type="text"
                      value={editingSubtaskValue}
                      onChange={(e) => setEditingSubtaskValue(e.target.value)}
                      className="flex-1 mr-2 p-1 rounded border dark:bg-gray-700 dark:text-gray-200 bg-white text-gray-900"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEditSubtask(idx);
                        if (e.key === "Escape") handleCancelEditSubtask();
                      }}
                    />
                    <button
                      type="button"
                      className="text-green-600 hover:text-green-800 mr-2"
                      onClick={() => handleSaveEditSubtask(idx)}
                      data-testid={`save-subtask-${idx}`}
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700"
                      onClick={handleCancelEditSubtask}
                    >
                      Huỷ
                    </button>
                  </>
                ) : (
                  <>
                    <span>{sub.title}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEditSubtask(idx, sub.title)}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(idx)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          {subtaskError && (
            <p className="text-red-500 text-sm mt-1">{subtaskError}</p>
          )}
          <div className="flex space-x-2 mt-2">
            <Input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="'Thêm nhiệm vụ con vào đây'"
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
            data-testid="close-main"
            className="px-4 py-2 bg-gray-300 dark:text-gray-200 dark:bg-gray-600 rounded"
          >
            Đóng
          </button>
          <button
            type="submit"
            data-testid="save-main"
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
