import Modal from "../UI/Modal";
import { useState } from "react";
import { useTaskStore } from "../../store/taskStore.js";

const TaskDetail = ({ task, onClose }) => {
  const { updateTask } = useTaskStore();
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const completedSubtasks = subtasks.filter((sub) => sub.completed).length;
  const totalSubtasks = subtasks.length;
  const progressPercentage =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleToggleSubtask = (subtaskId) => {
    const updatedSubtasks = subtasks.map((sub) =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );
    setSubtasks(updatedSubtasks);
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    updateTask(task.id, updatedTask);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Chi tiết Nhiệm vụ">
      {/* Thêm max-h và overflow-y-auto ở đây */}
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Các trường thông tin nhiệm vụ... */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Tiêu đề
          </label>
          <p className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
            {task.title}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Mô tả
          </label>
          <p
            className={`w-full p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 ${
              !task.description && "text-gray-500 italic"
            }`}
          >
            {task.description || "Không có mô tả"}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Trạng thái
          </label>
          <p className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
            {task.status === "toDo"
              ? "To Do"
              : task.status === "progress"
              ? "Progress"
              : "Done"}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Ưu tiên
          </label>
          <p className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
            {task.priority}
          </p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Ngày hết hạn
          </label>
          <p
            className={`w-full p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 ${
              !task.dueDate && "text-gray-500 italic"
            }`}
          >
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "Không có ngày hết hạn"}
          </p>
        </div>
        {/* Subtasks */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Nhiệm vụ con
          </label>
          <div className="mt-2">
            {totalSubtasks > 0 ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {completedSubtasks}/{totalSubtasks} nhiệm vụ con hoàn thành
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 italic mt-1">Không có nhiệm vụ con</p>
            )}
          </div>
          {totalSubtasks > 0 && (
            <div className="mt-3 max-h-32 overflow-y-auto border rounded">
              {subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className={`flex items-center justify-between p-2 border-b last:border-none ${
                    sub.completed
                      ? "bg-green-100 dark:bg-green-500"
                      : "bg-gray-100 dark:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleSubtask(sub.id)}
                      className="cursor-pointer"
                    />
                    <span
                      className={`ml-2 ${
                        sub.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {sub.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetail;
