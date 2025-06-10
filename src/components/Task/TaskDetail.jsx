import Modal from "../UI/Modal";

const TaskDetail = ({ task, onClose }) => {
  // Tính toán tiến trình subtasks
  const completedSubtasks =
    task.subtasks?.filter((sub) => sub.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progressPercentage =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <Modal isOpen={true} onClose={onClose} title="Chi tiết Nhiệm vụ">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tiêu đề */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Tiêu đề
            </label>
            <p className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
              {task.title}
            </p>
          </div>

          {/* Mô tả */}
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

          {/* Trạng thái */}
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

          {/* Ưu tiên */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Ưu tiên
            </label>
            <p className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
              {task.priority}
            </p>
          </div>

          {/* Ngày hết hạn */}
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
        </div>

        {/* Subtasks */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Subtasks
          </label>
          {/* Tiến trình subtasks */}
          <div className="mt-2">
            {totalSubtasks > 0 ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {completedSubtasks}/{totalSubtasks} subtasks hoàn thành
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
              <p className="text-gray-500 italic mt-1">Không có subtasks</p>
            )}
          </div>
          {/* Danh sách subtasks */}
          {totalSubtasks > 0 && (
            <div className="mt-3">
              {task.subtasks.map((sub) => (
                <div key={sub.id} className="flex items-center space-x-2 mt-1">
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    disabled
                    className="cursor-not-allowed"
                  />
                  <span
                    className={
                      sub.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800 dark:text-gray-200"
                    }
                  >
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end">
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
