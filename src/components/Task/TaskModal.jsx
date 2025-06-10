// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useTaskStore } from "../../store/taskStore.js";
// import { useBoardStore } from "../../store/boardStore.js";
// import Modal from "../UI/Modal";
// import Input from "../UI/Input";
// import { useState } from "react";
// import TaskDetail from "../../components/Task/TaskDetail.jsx";

// // Định nghĩa schema xác thực
// const taskSchema = z.object({
//   title: z.string().min(1, "Tiêu đề là bắt buộc"),
//   description: z.string().optional(),
//   status: z.enum(["toDo", "progress", "done"]),
//   priority: z.enum(["Thấp", "Trung Bình", "Cao"]),
//   dueDate: z
//     .string()
//     .optional()
//     .refine((val) => !val || !isNaN(Date.parse(val)), {
//       message: "Ngày hết hạn không hợp lệ",
//     }),
//   assignee: z.string().optional(),
//   subtasks: z
//     .array(
//       z.object({
//         id: z.number(),
//         title: z.string(),
//         completed: z.boolean(),
//       })
//     )
//     .optional(),
// });

// const TaskModal = ({ task, onClose, defaultStatus, isViewMode = false }) => {
//   const { addTask, updateTask } = useTaskStore();
//   const { currentBoard } = useBoardStore();
//   const [newSubtask, setNewSubtask] = useState("");
//   const isEditing = !!task && !isViewMode;

//   // Nếu ở chế độ xem, sử dụng TaskDetail
//   if (isViewMode) {
//     return <TaskDetail task={task} onClose={onClose} />;
//   }

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(taskSchema),
//     defaultValues: {
//       title: task?.title || "",
//       description: task?.description || "",
//       status: task?.status || defaultStatus || "toDo",
//       priority: task?.priority || "Trung Bình",
//       dueDate: task?.dueDate || "",
//       assignee: task?.assignee || "",
//       subtasks: task?.subtasks || [],
//     },
//   });

//   const subtasks = watch("subtasks") || [];

//   const onSubmit = (data) => {
//     const taskData = { ...data, boardId: currentBoard?.id };
//     if (isEditing) {
//       updateTask(task.id, taskData);
//     } else {
//       addTask(taskData);
//     }
//     onClose();
//   };

//   const handleAddSubtask = () => {
//     if (newSubtask.trim()) {
//       const newSubtasks = [
//         ...subtasks,
//         { id: Date.now(), title: newSubtask, completed: false },
//       ];
//       setValue("subtasks", newSubtasks);
//       setNewSubtask("");
//     }
//   };

//   const handleToggleSubtask = (index) => {
//     const updated = [...subtasks];
//     updated[index].completed = !updated[index].completed;
//     setValue("subtasks", updated);
//   };

//   return (
//     <Modal
//       isOpen={true}
//       onClose={onClose}
//       title={isEditing ? "Chỉnh sửa Nhiệm vụ" : "Tạo Nhiệm vụ"}
//     >
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="space-y-4"
//         autoComplete="off"
//       >
//         {/* Title */}
//         <div>
//           <Input {...register("title")} placeholder="Tiêu đề task" />
//           {errors.title && (
//             <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
//           )}
//         </div>

//         {/* Description */}
//         <textarea
//           {...register("description")}
//           className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded"
//           placeholder="Mô tả"
//         />

//         {/* Status */}
//         <div>
//           <label className="text-sm">Trạng thái</label>
//           <select
//             {...register("status")}
//             className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded"
//           >
//             <option value="toDo">To Do</option>
//             <option value="progress">Progress</option>
//             <option value="done">Done</option>
//           </select>
//         </div>

//         {/* Priority */}
//         <div>
//           <label className="text-sm">Ưu tiên</label>
//           <select
//             {...register("priority")}
//             className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded"
//           >
//             <option value="Thấp">Thấp</option>
//             <option value="Trung Bình">Trung Bình</option>
//             <option value="Cao">Cao</option>
//           </select>
//         </div>

//         {/* Due Date */}
//         <div>
//           <label className="text-sm">Ngày hết hạn</label>
//           <Input type="date" {...register("dueDate")} />
//           {errors.dueDate && (
//             <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
//           )}
//         </div>

//         {/* Assignee */}
//         <div>
//           <label className="text-sm">Người được giao</label>
//           <Input {...register("assignee")} placeholder="VD: Nguyễn Văn A" />
//         </div>

//         {/* Subtasks */}
//         <div>
//           <label className="text-sm">Subtasks</label>
//           {subtasks.map((sub, idx) => (
//             <div key={sub.id} className="flex items-center space-x-2 mt-1">
//               <input
//                 type="checkbox"
//                 checked={sub.completed}
//                 onChange={() => handleToggleSubtask(idx)}
//               />
//               <span
//                 className={sub.completed ? "line-through text-gray-500" : ""}
//               >
//                 {sub.title}
//               </span>
//             </div>
//           ))}

//           <div className="flex space-x-2 mt-2">
//             <Input
//               value={newSubtask}
//               onChange={(e) => setNewSubtask(e.target.value)}
//               placeholder="Thêm subtask"
//             />
//             <button
//               type="button"
//               onClick={handleAddSubtask}
//               className="px-2 py-1 bg-primary text-white rounded"
//             >
//               Thêm
//             </button>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end space-x-2">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
//           >
//             Đóng
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-primary text-white rounded"
//           >
//             {isEditing ? "Lưu" : "Tạo"}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default TaskModal;
