import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBoardStore } from "../../store/boardStore.js";
import Modal from "../UI/Modal";
import Input from "../UI/Input";
import { useEffect } from "react";
// Custom hook để lấy danh sách boards
const useBoards = () => useBoardStore((state) => state.boards);

const boardSchema = z.object({
  name: z.string().min(1, "Tên board là bắt buộc"),
});

const RenameModal = ({ isOpen, onClose, board }) => {
  const { updateBoard } = useBoardStore();
  const boards = useBoards();

  // Thêm log để debug
  useEffect(() => {
    console.log("Current boards in RenameModal:", boards);
  }, [boards]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: board?.name || "",
    },
  });

  // Theo dõi giá trị name để debug
  const nameValue = watch("name");
  useEffect(() => {
    console.log("Name value changed:", nameValue);
  }, [nameValue]);

  const onSubmit = (data) => {
    console.log("Submitting data:", data);
    // Kiểm tra trùng lặp với các board khác (ngoại trừ board hiện tại)
    const isDuplicate = boards.some(
      (b) =>
        b.id !== board?.id && b.name.toLowerCase() === data.name.toLowerCase()
    );
    if (isDuplicate) {
      console.log("Duplicate name detected, preventing rename.");
      return; // Ngăn submit nếu tên trùng
    }
    if (board) {
      updateBoard(board.id, data);
      reset();
      onClose();
    }
  };

  // Kiểm tra lỗi trùng lặp để hiển thị thông báo
  const showDuplicateError = () => {
    const isDuplicate = boards.some(
      (b) =>
        b.id !== board?.id && b.name.toLowerCase() === nameValue.toLowerCase()
    );
    return isDuplicate
      ? "Tên board này đã tồn tại, vui lòng đổi tên board khác."
      : "";
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
          <div className="bg-red-100 text-red-700 p-2 mt-2 rounded">
            <p className="text-sm">{errors.name.message}</p>
          </div>
        )}
        {showDuplicateError() && (
          <div className="bg-red-100 text-red-700 p-2 mt-2 rounded">
            <p className="text-sm">{showDuplicateError()}</p>
          </div>
        )}
        <div className="flex justify-end space-x-3">
          <button
            data-testid="cancel-rename-btn"
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
            data-testid="submit-rename-btn"
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
