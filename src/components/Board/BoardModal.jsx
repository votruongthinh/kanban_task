import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBoardStore } from "../../store/boardStore.js";
import Modal from "../UI/Modal";
import Input from "../UI/Input";

// Định nghĩa schema xác thực với Zod
const boardSchema = z.object({
  name: z.string().min(1, "Tên board là bắt buộc"),
});

const BoardModal = ({ isOpen, onClose, board }) => {
  const { addBoard, updateBoard } = useBoardStore();

  // Khởi tạo form với React Hook Form và Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: board?.name || "",
    },
  });

  const onSubmit = (data) => {
    if (board) {
      updateBoard(board.id, data);
    } else {
      addBoard(data.name);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={board ? "Chỉnh sửa Board" : "Thêm Board mới"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("name")} placeholder="Nhập tên board..." />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded"
          >
            {board ? "Lưu" : "Tạo"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BoardModal;
