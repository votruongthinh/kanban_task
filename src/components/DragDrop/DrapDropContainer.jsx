import { useCallback, useState } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTaskStore } from "../../store/taskStore.js";
import TaskCard from "../Task/TaskCard.jsx";

// Thành phần cho từng task có thể kéo thả
const SortableTask = ({ task, onTaskClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onTaskClick(task)}
      className="cursor-move mb-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
    >
      <TaskCard task={task} />
    </div>
  );
};

// Thành phần cho từng cột
const SortableColumn = ({
  column,
  tasks,
  onTaskClick,
  onCreateTask,
  isOver,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-lg p-3 min-h-[200px] flex flex-col"
    >
      <h2 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3 cursor-grab">
        {column.title} ({tasks.length})
      </h2>
      <div className="flex-1 space-y-2">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} onTaskClick={onTaskClick} />
          ))}
        </SortableContext>
        {/* Drop zone với đường ngắt khúc */}
        <div
          className={`h-10 border-2 border-dotted border-gray-400 dark:border-gray-600 rounded text-center text-gray-600 dark:text-gray-300 text-sm transition-opacity ${
            isOver ? "opacity-100" : "opacity-0"
          }`}
        >
          Hãy thả vào đây
        </div>
      </div>
      <div className="mt-3">
        <button
          onClick={() => onCreateTask(column.status)}
          className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-1.5 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          + Tạo Task
        </button>
      </div>
    </div>
  );
};

const DragDropContainer = ({
  columns,
  tasks,
  currentBoardId,
  onTaskClick,
  onCreateTask,
}) => {
  const { updateTaskStatus } = useTaskStore();
  const [activeId, setActiveId] = useState(null);
  const [isOver, setIsOver] = useState(false);

  const getTasksByStatus = useCallback(
    (status) =>
      tasks.filter(
        (task) => task.status === status && task.boardId === currentBoardId
      ),
    [tasks, currentBoardId]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setIsOver(true); // Hiển thị drop zone khi bắt đầu kéo
  };

  const handleDragOver = (event) => {
    const { over } = event;
    if (over) {
      setIsOver(true); // Giữ drop zone hiển thị khi kéo qua bất kỳ cột nào
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveId(null);
    setIsOver(false); // Ẩn drop zone khi kết thúc kéo
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = columns.find((col) => col.id === activeId);
    const overColumn = columns.find((col) => col.id === overId);

    if (activeColumn && overColumn) {
      const oldIndex = columns.findIndex((col) => col.id === activeId);
      const newIndex = columns.findIndex((col) => col.id === overId);
      if (oldIndex !== newIndex) {
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        console.log("New column order:", newColumns);
      }
    } else {
      const activeTaskId = active.id;
      const overTaskId = over.id;

      const activeColumn = columns.find((col) =>
        getTasksByStatus(col.status).some((task) => task.id === activeTaskId)
      );
      const overColumn =
        columns.find((col) =>
          getTasksByStatus(col.status).some((task) => task.id === overTaskId)
        ) || columns.find((col) => col.id === over.id);

      if (!activeColumn || !overColumn) return;

      if (activeColumn.id !== overColumn.id) {
        updateTaskStatus(activeTaskId, overColumn.status);
      } else {
        const activeTasks = getTasksByStatus(activeColumn.status);
        const overTasks = getTasksByStatus(overColumn.status);
        const activeIndex = activeTasks.findIndex(
          (task) => task.id === activeTaskId
        );
        const overIndex = overTasks.findIndex((task) => task.id === overTaskId);

        if (activeIndex !== overIndex) {
          const updatedTasks = arrayMove(activeTasks, activeIndex, overIndex);
        }
      }
    }
  };

  const activeTask = tasks.find((task) => task.id === activeId);
  const activeColumn = columns.find((col) => col.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <SortableContext
          items={columns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((column) => (
            <SortableColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.status)}
              onTaskClick={onTaskClick}
              onCreateTask={onCreateTask}
              isOver={isOver} // Truyền trạng thái isOver xuống component
            />
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-md opacity-80">
            <TaskCard task={activeTask} />
          </div>
        ) : activeColumn ? (
          <div className="flex-1 bg-gray-500 dark:bg-gray-800 rounded-lg p-3 min-h-[200px] flex flex-col opacity-80">
            <h2 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {activeColumn.title}
            </h2>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

const sortableKeyboardCoordinates = (event) => {
  return { x: 0, y: 0 };
};

export default DragDropContainer;
// Added responsive styles for mobile view
