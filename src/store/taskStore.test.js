import { act } from "react-dom/test-utils";
import { useTaskStore } from "./taskStore";

describe("useTaskStore", () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [] });
    window.localStorage.removeItem("task-storage");
  });

  it("addTask thêm task mới", () => {
    act(() => {
      useTaskStore.getState().addTask({
        boardId: "b1",
        title: "Task 1",
        status: "toDo",
        priority: "Cao",
        description: "desc",
        assignee: "A",
        subtasks: [],
      });
    });
    const tasks = useTaskStore.getState().tasks;
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe("Task 1");
    expect(tasks[0].id).toBeTruthy();
    expect(tasks[0].boardId).toBe("b1");
  });

  it("updateTask cập nhật dữ liệu đúng", () => {
    let id;
    act(() => {
      useTaskStore.getState().addTask({ boardId: "b2", title: "Test" });
      id = useTaskStore.getState().tasks[0].id;
      useTaskStore
        .getState()
        .updateTask(id, { title: "Updated", status: "done" });
    });
    const tasks = useTaskStore.getState().tasks;
    expect(tasks[0].title).toBe("Updated");
    expect(tasks[0].status).toBe("done");
  });

  it("updateTaskStatus chuyển status đúng", () => {
    let id;
    act(() => {
      useTaskStore
        .getState()
        .addTask({ boardId: "b3", title: "Status Task", status: "toDo" });
      id = useTaskStore.getState().tasks[0].id;
      useTaskStore.getState().updateTaskStatus(id, "progress");
    });
    expect(useTaskStore.getState().tasks[0].status).toBe("progress");
  });

  it("deleteTask xóa đúng task", () => {
    let id;
    act(() => {
      useTaskStore.getState().addTask({ boardId: "b4", title: "Delete Me" });
      id = useTaskStore.getState().tasks[0].id;
      useTaskStore.getState().deleteTask(id);
    });
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  it("updateTaskOrder sắp xếp lại theo id và status", () => {
    let id1, id2, id3;
    act(() => {
      useTaskStore
        .getState()
        .addTask({ boardId: "b5", title: "A", status: "toDo" });
      useTaskStore
        .getState()
        .addTask({ boardId: "b5", title: "B", status: "toDo" });
      useTaskStore
        .getState()
        .addTask({ boardId: "b5", title: "C", status: "toDo" });
      const tasks = useTaskStore.getState().tasks;
      id1 = tasks[0].id;
      id2 = tasks[1].id;
      id3 = tasks[2].id;
      // Đảo lại thứ tự thành C, A, B
      useTaskStore.getState().updateTaskOrder([id3, id1, id2], "toDo");
    });
    const titles = useTaskStore
      .getState()
      .tasks.filter((t) => t.status === "toDo")
      .map((t) => t.title);
    expect(titles).toEqual(["C", "A", "B"]);
  });

  it("updateTaskOrder không ảnh hưởng task khác status", () => {
    let id1, id2, id3, id4;
    act(() => {
      useTaskStore
        .getState()
        .addTask({ boardId: "b6", title: "A", status: "toDo" });
      useTaskStore
        .getState()
        .addTask({ boardId: "b6", title: "B", status: "toDo" });
      useTaskStore
        .getState()
        .addTask({ boardId: "b6", title: "X", status: "progress" });
      useTaskStore
        .getState()
        .addTask({ boardId: "b6", title: "C", status: "toDo" });
      const tasks = useTaskStore.getState().tasks;
      id1 = tasks[0].id;
      id2 = tasks[1].id;
      id3 = tasks[2].id;
      id4 = tasks[3].id;
      useTaskStore.getState().updateTaskOrder([id4, id1, id2], "toDo");
    });
    const tasks = useTaskStore.getState().tasks;
    const todoTitles = tasks
      .filter((t) => t.status === "toDo")
      .map((t) => t.title);
    const progressTitles = tasks
      .filter((t) => t.status === "progress")
      .map((t) => t.title);
    expect(todoTitles).toEqual(["C", "A", "B"]);
    expect(progressTitles).toEqual(["X"]);
  });
});
