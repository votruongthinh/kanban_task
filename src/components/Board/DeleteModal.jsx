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

const DeleteModal = ({ isOpen, onClose, board }) => {
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

  const onSubmit = () => {
    if (board) {
      deleteBoard(board.id);
      reset();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title={`Xóa Board: ${board?.name}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Bạn có chắc chắn muốn xóa board "{board?.name}"? Vui lòng nhập
          <span className="text-red-500 font-bold"> "DELETE" </span> để xác
          nhận.
        </p>
        <Input
          {...register("confirmText")}
          placeholder="DELETE"
          className="border rounded-md p-2 w-full mb-4 bg-red-100" // Changed background color to red
        />
        {errors.confirmText && (
          <p className="text-red-500 text-sm mb-2">
            {errors.confirmText.message}
          </p>
        )}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
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

export default DeleteModal;
