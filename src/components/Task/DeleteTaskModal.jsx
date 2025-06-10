import Modal from "../UI/Modal";

const DeleteTaskModal = ({ task, onClose, onDelete }) => {
  const handleDeleteConfirm = () => {
    console.log("Delete confirmed for task in DeleteTaskModal:", task);
    if (onDelete) {
      console.log("Calling onDelete with task:", task);
      onDelete(); // Gọi hàm onDelete (handleDeleteConfirm từ KanbanBoard)
    } else {
      console.log("onDelete is undefined in DeleteTaskModal");
    }
    onClose(); // Đóng modal sau khi xóa
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Xóa Nhiệm vụ">
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Bạn có chắc chắn muốn xóa nhiệm vụ "
          <strong>{task?.title || "N/A"}</strong>"?
          {task?.subtasks?.length > 0 && (
            <span className="block text-sm text-red-500 mt-2">
              Lưu ý: {task.subtasks.length} subtasks liên quan sẽ bị xóa cùng
              nhiệm vụ này.
            </span>
          )}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTaskModal;
