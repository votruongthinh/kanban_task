import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBoardStore } from "../../store/boardStore.js";
import Modal from "../UI/Modal";
import Input from "../UI/Input";

const boardSchema = z.object({
  name: z.string().min(1, "Tên board là bắt buộc"),
});

const RenameModal = ({ isOpen, onClose, board }) => {
  const { updateBoard } = useBoardStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: board?.name || "",
    },
  });

  const onSubmit = (data) => {
    if (board) {
      updateBoard(board.id, data);
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
      title="Đổi tên board"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("name")}
          placeholder="Nhập tên mới..."
          className="border rounded-md p-2 w-full mb-4"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-2">{errors.name.message}</p>
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
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Đổi tên
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RenameModal;
