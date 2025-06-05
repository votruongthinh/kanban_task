import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBoardStore } from "../../store/boardStore.js";
import Modal from "../UI/Modal";
import Input from "../UI/Input";

const deleteSchema = z.object({
  confirmText: z.literal("DELETE", {
    errorMap: () => ({ message: "Vui lòng nhập đúng 'DELETE' để xác nhận" }),
  }),
});

// State toàn cục cho DeleteModal
let openDeleteModalCallback = null;

const DeleteModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [board, setBoard] = useState(null);
  const { deleteBoard } = useBoardStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(deleteSchema),
    defaultValues: {
      confirmText: "",
    },
  });

  // Hàm để mở modal từ bên ngoài
  const openModal = (boardData) => {
    setBoard(boardData);
    setIsOpen(true);
    reset({ confirmText: "" }); // Reset form
  };

  // Đăng ký callback để BoardList có thể gọi
  if (!openDeleteModalCallback) {
    openDeleteModalCallback = openModal;
  }

  const onSubmit = () => {
    if (board) {
      deleteBoard(board.id);
      closeModal();
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setBoard(null);
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Xác nhận xóa Board">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Bạn có chắc muốn xóa board "{board?.name}"? Vui lòng nhập "DELETE" để
          xác nhận.
        </p>
        <Input
          {...register("confirmText")}
          placeholder="Nhập 'DELETE' để xác nhận"
          className="border rounded-md p-2 w-full mb-4"
        />
        {errors.confirmText && (
          <p className="text-red-500 text-sm mb-2">
            {errors.confirmText.message}
          </p>
        )}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Xóa
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Export hàm để mở modal từ bên ngoài
export const openDeleteModal = (board) => {
  if (openDeleteModalCallback) {
    openDeleteModalCallback(board);
  }
};

export default DeleteModal;
