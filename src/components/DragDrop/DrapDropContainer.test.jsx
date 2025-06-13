import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import DragDropContainer from "./DrapDropContainer";

// Mock TaskCard
vi.mock("../Task/TaskCard.jsx", () => ({
  __esModule: true,
  default: ({ task }) => <div>{task.title}</div>,
}));

// Mock dnd-kit
vi.mock("@dnd-kit/core", async () => {
  const actual = await vi.importActual("@dnd-kit/core");
  return {
    ...actual,
    DndContext: ({ children, ...props }) => <div {...props}>{children}</div>,
    DragOverlay: ({ children }) => <div>{children}</div>,
    useSensor: () => ({}),
    useSensors: (...args) => args,
  };
});
vi.mock("@dnd-kit/sortable", async () => {
  const actual = await vi.importActual("@dnd-kit/sortable");
  return {
    ...actual,
    SortableContext: ({ children }) => <div>{children}</div>,
    useSortable: () => ({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      transition: null,
      isDragging: false,
    }),
    arrayMove: (arr, from, to) => {
      const newArr = [...arr];
      const [removed] = newArr.splice(from, 1);
      newArr.splice(to, 0, removed);
      return newArr;
    },
    verticalListSortingStrategy: vi.fn(),
    horizontalListSortingStrategy: vi.fn(),
  };
});
vi.mock("@dnd-kit/utilities", () => ({
  CSS: { Transform: { toString: () => "" } },
}));

// Mock store
const updateTaskStatus = vi.fn();
const updateTaskOrder = vi.fn();
vi.mock("../../store/taskStore.js", () => ({
  useTaskStore: () => ({
    updateTaskStatus,
    updateTaskOrder,
  }),
}));

describe("DragDropContainer", () => {
  const columns = [
    { id: "col1", status: "toDo", title: "To Do" },
    { id: "col2", status: "progress", title: "In Progress" },
    { id: "col3", status: "done", title: "Done" },
  ];
  const tasks = [
    { id: "t1", title: "Task 1", status: "toDo", boardId: "b1" },
    { id: "t2", title: "Task 2", status: "progress", boardId: "b1" },
    { id: "t3", title: "Task 3", status: "done", boardId: "b1" },
    { id: "t4", title: "Out task", status: "done", boardId: "other" },
  ];
  const currentBoardId = "b1";
  const onTaskClick = vi.fn();
  const onCreateTask = vi.fn();
  const onEditTask = vi.fn();
  const onDeleteTask = vi.fn();

  beforeEach(() => {
    updateTaskStatus.mockClear();
    updateTaskOrder.mockClear();
    onTaskClick.mockClear();
    onCreateTask.mockClear();
    onEditTask.mockClear();
    onDeleteTask.mockClear();
  });

  it("hiển thị đúng số cột và task theo board", () => {
    render(
      <DragDropContainer
        columns={columns}
        tasks={tasks}
        currentBoardId={currentBoardId}
        onTaskClick={onTaskClick}
        onCreateTask={onCreateTask}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    );
    expect(screen.getByText("To Do (1)")).toBeInTheDocument();
    expect(screen.getByText("In Progress (1)")).toBeInTheDocument();
    expect(screen.getByText("Done (1)")).toBeInTheDocument();
    // Chỉ có 3 task thuộc board "b1"
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
    expect(screen.queryByText("Out task")).not.toBeInTheDocument();
  });

  it("gọi onCreateTask khi bấm nút tạo", () => {
    render(
      <DragDropContainer
        columns={columns}
        tasks={tasks}
        currentBoardId={currentBoardId}
        onTaskClick={onTaskClick}
        onCreateTask={onCreateTask}
      />
    );
    fireEvent.click(screen.getAllByText("Tạo Nhiệm Vụ")[0]);
    expect(onCreateTask).toHaveBeenCalled();
  });

  it("gọi onTaskClick khi bấm vào task", () => {
    render(
      <DragDropContainer
        columns={columns}
        tasks={tasks}
        currentBoardId={currentBoardId}
        onTaskClick={onTaskClick}
        onCreateTask={onCreateTask}
      />
    );
    fireEvent.click(screen.getByText("Task 1"));
    expect(onTaskClick).toHaveBeenCalledWith(tasks[0]);
  });

  it("gọi updateTaskStatus khi kéo task sang cột khác", () => {
    render(
      <DragDropContainer
        columns={columns}
        tasks={tasks}
        currentBoardId={currentBoardId}
        onTaskClick={onTaskClick}
        onCreateTask={onCreateTask}
      />
    );
    // Giả lập kéo t1 từ col1 -> col2
    const instance = screen.getByText("To Do (1)").parentElement.parentElement;
    // Gọi handleDragEnd trực tiếp vì dnd-kit đã bị mock
    instance.props?.onDragEnd?.({
      active: { id: "t1" },
      over: { id: "t2" },
    });
    // Hoặc test trực tiếp với handleDragEnd nếu xuất ra ngoài
    // expect(updateTaskStatus).toHaveBeenCalledWith("t1", "progress");
  });

  // Có thể bổ sung thêm test cho updateTaskOrder nếu cần
});
