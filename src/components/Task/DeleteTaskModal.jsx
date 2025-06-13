import { useState } from "react";
import Modal from "../UI/Modal";

const DeleteTaskModal = ({ task, onClose, onDelete }) => {
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  const handleDeleteConfirm = () => {
    if (confirmText.trim().toLowerCase() !== "delete") {
      setError('Bạn phải nhập "delete" để xác nhận xóa.');
      return;
    }
    setError("");
    if (onDelete) {
      onDelete();
    }
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Xóa Nhiệm vụ">
      <div className="p-4">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Bạn có chắc chắn muốn xóa nhiệm vụ "
          <strong>{task?.title || "N/A"}</strong>"?
          {task?.subtasks?.length > 0 && (
            <span className="block text-sm text-red-500 mt-2">
              Lưu ý: {task.subtasks.length} nhiệm vụ con liên quan sẽ bị xóa
              cùng nhiệm vụ này.
            </span>
          )}
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nhập <span className="font-bold text-red-500">delete</span> để xác
            nhận xóa:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => {
              setConfirmText(e.target.value);
              setError("");
            }}
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 outline-none"
            placeholder='Nhập "delete" để xác nhận'
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
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
            disabled={confirmText.trim().toLowerCase() !== "delete"}
          >
            Xóa
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteTaskModal;
