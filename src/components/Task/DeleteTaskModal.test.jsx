import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import DeleteTaskModal from "./DeleteTaskModal";

// Mock Modal UI để test đơn giản
vi.mock("../UI/Modal", () => ({
  default: ({ children, title, onClose }) => (
    <div data-testid="modal">
      <div data-testid="modal-title">{title}</div>
      <button data-testid="modal-close" onClick={onClose}>
        Đóng
      </button>
      {children}
    </div>
  ),
}));

describe("DeleteTaskModal", () => {
  const task = { title: "Task 1", subtasks: [{}, {}] };

  it("hiển thị đúng tiêu đề và nội dung", () => {
    render(
      <DeleteTaskModal task={task} onClose={() => {}} onDelete={() => {}} />
    );
    expect(screen.getByTestId("modal-title").textContent).toContain(
      "Xóa Nhiệm vụ"
    );
    expect(
      screen.getByText(/Bạn có chắc chắn muốn xóa nhiệm vụ/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/2 nhiệm vụ con liên quan sẽ bị xóa/)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nhập "delete"/i)).toBeInTheDocument();
  });

  it('nút "Xóa" bị disable nếu chưa nhập đúng "delete"', () => {
    render(
      <DeleteTaskModal task={task} onClose={() => {}} onDelete={() => {}} />
    );
    const btnDelete = screen.getByText("Xóa");
    expect(btnDelete).toBeDisabled();
    fireEvent.change(screen.getByPlaceholderText(/Nhập "delete"/i), {
      target: { value: "abc" },
    });
    expect(btnDelete).toBeDisabled();
  });

  it("hiện lỗi khi nhập sai xác nhận xóa", () => {
    render(
      <DeleteTaskModal task={task} onClose={() => {}} onDelete={() => {}} />
    );
    fireEvent.change(screen.getByPlaceholderText(/Nhập "delete"/i), {
      target: { value: "abc" },
    });
  });

  it('gọi onDelete và onClose khi xác nhận đúng "delete"', () => {
    const onDelete = vi.fn();
    const onClose = vi.fn();
    render(
      <DeleteTaskModal task={task} onClose={onClose} onDelete={onDelete} />
    );
    fireEvent.change(screen.getByPlaceholderText(/Nhập "delete"/i), {
      target: { value: "delete" },
    });
    const btnDelete = screen.getByText("Xóa");
    expect(btnDelete).not.toBeDisabled();
    fireEvent.click(btnDelete);
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('gọi onClose khi nhấn "Hủy"', () => {
    const onClose = vi.fn();
    render(
      <DeleteTaskModal task={task} onClose={onClose} onDelete={() => {}} />
    );
    fireEvent.click(screen.getByText("Hủy"));
    expect(onClose).toHaveBeenCalled();
  });
});
