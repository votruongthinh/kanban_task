import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBoardStore } from "../../store/boardStore.js";
import Modal from "../UI/Modal";
import Input from "../UI/Input";
import { useEffect, useState } from "react";

// Custom hook để lấy danh sách boards
const useBoards = () => useBoardStore((state) => state.boards);

const BoardModal = ({ isOpen, onClose, board }) => {
  const { addBoard, updateBoard } = useBoardStore();
  const boards = useBoards();

  // Thêm log để debug
  useEffect(() => {
    console.log("Current boards in BoardModal:", boards);
  }, [boards]);

  // Tạo schema với boards từ state
  const boardSchema = z.object({
    name: z.string().min(1, "Tên board là bắt buộc"), // Chỉ kiểm tra bắt buộc
  });

  // Khởi tạo form với React Hook Form và Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(boardSchema),
    defaultValues: {
      name: board?.name || "", // Sử dụng board.name nếu có, nếu không thì rỗng
    },
    mode: "onSubmit", // Chỉ chạy validation khi submit
  });

  // Reset form khi mở modal để đảm bảo giá trị đúng
  useEffect(() => {
    if (isOpen) {
      reset({
        name: board?.name || "",
      });
      console.log("Modal opened, form reset with name:", board?.name || "");
    }
  }, [isOpen, board, reset]);

  // Theo dõi giá trị name để debug
  const nameValue = watch("name");
  useEffect(() => {
    console.log("Name value changed:", nameValue);
  }, [nameValue]);

  // State để lưu lỗi sau submit
  const [submitError, setSubmitError] = useState("");

  const onSubmit = (data) => {
    console.log("Submitting data:", data);
    // Kiểm tra khoảng trắng và trùng lặp thủ công
    const originalValue = watch("name"); // Lấy giá trị gốc từ form
    const trimmedValue = originalValue.trim();
    const hasWhitespace = originalValue !== trimmedValue;
    const isDuplicate = boards.some(
      (b) =>
        b.id !== board?.id &&
        b.name.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (hasWhitespace) {
      console.log("Whitespace detected in original:", originalValue);
      setSubmitError("Tên board không được chứa khoảng trắng ở đầu hoặc cuối.");
      return; // Ngăn submit nếu có khoảng trắng
    }
    if (isDuplicate) {
      console.log("Duplicate name detected, showing error.");
      setSubmitError("Tên board đã tồn tại, vui lòng chọn tên khác.");
      return; // Ngăn submit nếu trùng
    }

    setSubmitError(""); // Xóa lỗi nếu hợp lệ
    if (board) {
      updateBoard(board.id, { name: trimmedValue }); // Lưu giá trị đã trim
    } else {
      addBoard(trimmedValue); // Lưu giá trị đã trim
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset({ name: "" }); // Reset form khi đóng modal
        setSubmitError(""); // Xóa lỗi khi đóng
        onClose();
      }}
      title={board ? "Chỉnh sửa Board" : "Thêm Board mới"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("name")} placeholder="Nhập tên board..." />
        {errors.name && (
          <div className="bg-red-100 text-red-700 p-2 mt-2 rounded">
            <p className="text-sm">{errors.name.message}</p>
          </div>
        )}
        {submitError && (
          <div className="bg-red-100 text-red-700 p-2 mt-2 rounded">
            <p className="text-sm">{submitError}</p>
          </div>
        )}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => {
              reset({ name: "" }); // Reset form khi nhấn Hủy
              setSubmitError(""); // Xóa lỗi khi nhấn Hủy
              onClose();
            }}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Tạo
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BoardModal;
