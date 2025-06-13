import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import TaskCard from "./TaskCard";

describe("TaskCard", () => {
  const task = {
    id: 1,
    title: "Task test",
    status: "toDo",
    subtasks: [
      { id: 1, title: "Sub1", completed: true },
      { id: 2, title: "Sub2", completed: false },
    ],
  };

  it("hiển thị tiêu đề task", () => {
    render(<TaskCard task={task} />);
    expect(screen.getByTestId("task-card-title").textContent).toBe("Task test");
  });

  it("hiển thị đúng số lượng subtasks", () => {
    render(<TaskCard task={task} />);
    expect(screen.getByText("1/2 nhiệm vụ con")).toBeInTheDocument();
  });

  it("click vào card gọi onTaskClick", () => {
    const onTaskClick = vi.fn();
    render(<TaskCard task={task} onTaskClick={onTaskClick} />);
    fireEvent.click(screen.getByTestId("task-card"));
    expect(onTaskClick).toHaveBeenCalledWith(task);
  });

  it("không gọi onTaskClick khi click vào menu", () => {
    const onTaskClick = vi.fn();
    render(<TaskCard task={task} onTaskClick={onTaskClick} />);
    fireEvent.click(screen.getByTestId("task-card-menu-btn"));
    expect(onTaskClick).not.toHaveBeenCalled();
  });

  it("mở menu và click 'Chỉnh sửa' gọi onEditTask", () => {
    const onEditTask = vi.fn();
    render(<TaskCard task={task} onEditTask={onEditTask} />);
    fireEvent.click(screen.getByTestId("task-card-menu-btn"));
    fireEvent.click(screen.getByTestId("task-card-edit-btn"));
    expect(onEditTask).toHaveBeenCalledWith(task);
  });

  it("mở menu và click 'Xóa' gọi onDeleteTask", () => {
    const onDeleteTask = vi.fn();
    render(<TaskCard task={task} onDeleteTask={onDeleteTask} />);
    fireEvent.click(screen.getByTestId("task-card-menu-btn"));
    fireEvent.click(screen.getByTestId("task-card-delete-btn"));
    expect(onDeleteTask).toHaveBeenCalledWith(task);
  });

  it("menu sẽ đóng khi click ngoài", () => {
    render(<TaskCard task={task} />);
    fireEvent.click(screen.getByTestId("task-card-menu-btn"));
    expect(screen.getByTestId("task-card-edit-btn")).toBeInTheDocument();
    // Giả lập click ngoài (document)
    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId("task-card-edit-btn")).not.toBeInTheDocument();
  });

  it("task done thì tiêu đề có line-through", () => {
    const doneTask = { ...task, status: "done" };
    render(<TaskCard task={doneTask} />);
    const title = screen.getByTestId("task-card-title");
    expect(title.className).toMatch(/line-through/);
  });
});
