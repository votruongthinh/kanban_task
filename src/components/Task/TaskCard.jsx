const TaskCard = ({ task }) => {
  const completedSubtasks = task.subtasks.filter((sub) => sub.completed).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <div className="p-2 bg-lightCard dark:bg-darkCard rounded-lg border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-shadow mb-2 cursor-pointer">
      <div className="flex justify-between items-center">
        {" "}
        <h3
          className={`font-semibold text-gray-800 dark:text-gray-200 text-sm ${
            task.status === "done"
              ? "line-through text-green-500 dark:text-green-400"
              : ""
          }`}
        >
          {task.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-xs">
          {task.status}
        </p>
      </div>{" "}
      {totalSubtasks > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {completedSubtasks}/{totalSubtasks} subtasks
        </p>
      )}
    </div>
  );
};

export default TaskCard;
