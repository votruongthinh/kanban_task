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
const SortableTask = ({ task, onTaskClick, onEditTask, onDeleteTask }) => {
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
      <TaskCard
        task={task}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
};

// Thành phần cho từng cột
const SortableColumn = ({
  column,
  tasks,
  onTaskClick,
  onCreateTask,
  onEditTask,
  onDeleteTask,
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
      className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-lg p-2 sm:p-3 min-h-[150px] sm:min-h-[200px] flex flex-col"
    >
      <div className="flex items-center mb-2">
        <span
          className={`w-3 h-3 rounded-full mr-2 ${
            column.status === "toDo"
              ? "bg-purple-500" // To Do - Purple
              : column.status === "progress"
              ? "bg-blue-500" // Progress - Blue
              : column.status === "done"
              ? "bg-green-500" // Done - Green
              : "bg-gray-500"
          }`}
        ></span>
        <h2 className="text-md font-semibold text-gray-800 dark:text-gray-200 cursor-grab">
          {column.title} ({tasks.length})
        </h2>
      </div>
      <div className="flex-1 space-y-2">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              onTaskClick={onTaskClick}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </SortableContext>
        {/* Drop zone với đường ngắt khúc */}
        <div
          className={`h-8 sm:h-10 border-2 border-dotted border-gray-400 dark:border-gray-600 rounded text-center text-gray-600 dark:text-gray-300 text-xs sm:text-sm transition-opacity ${
            isOver ? "opacity-100" : "opacity-0"
          }`}
        >
          Hãy thả vào đây
        </div>
      </div>
      <div className="mt-2">
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
  onEditTask = () => {},
  onDeleteTask = () => {}, // Thêm onDeleteTask với default empty function
}) => {
  const { updateTaskStatus, updateTaskOrder } = useTaskStore();
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
    setIsOver(true);
  };

  const handleDragOver = (event) => {
    const { over } = event;
    if (over) {
      setIsOver(true);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    setActiveId(null);
    setIsOver(false);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumn = columns.find((col) => col.id === activeId);
    const overColumn = columns.find((col) => col.id === overId);

    if (activeColumn && overColumn) {
      const oldIndex = columns.findIndex((col) => col.id === activeId);
      const newIndex = columns.findIndex((col) => col.id === overId);
      if (oldIndex !== newIndex) {
        console.log(
          "New column order:",
          arrayMove(columns, oldIndex, newIndex)
        );
        // Cần truyền lên KanbanBoard để áp dụng
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
        const overIndex = activeTasks.findIndex(
          (task) => task.id === overTaskId
        );
        const activeIndex = activeTasks.findIndex(
          (task) => task.id === activeTaskId
        );
        if (activeIndex !== overIndex) {
          const updatedTasks = arrayMove(activeTasks, activeIndex, overIndex);
          console.log(
            "New task order before update:",
            updatedTasks.map((t) => t.title)
          );
          updateTaskOrder(
            updatedTasks.map((task) => task.id),
            activeColumn.status
          );
          console.log(
            "New task order after update:",
            updatedTasks.map((t) => t.title)
          );
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
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              isOver={isOver}
            />
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeTask ? (
          <div className="rounded-lg bg-white dark:bg-gray-800 shadow-md opacity-80">
            <TaskCard
              task={activeTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
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
//
