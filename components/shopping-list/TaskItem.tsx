// import type
import { Task } from "@/types/Task";

// import icon
import { TrashIcon } from "@heroicons/react/24/outline";

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onDelete }: TaskItemProps) {
  return (
    <div className="flex px-6 py-5 items-center border border-gray-300 mb-6 rounded-lg transition-all duration-200 hover:scale-[1.01] hover:-translate-y-1 hover:shadow-lg hover:border-gray-400">
      <div className="flex items-center flex-1">{task.text}</div>
      <div className="flex space-x-4">
        <button
          className="text-red-600 hover:text-red-800 cursor-pointer"
          onClick={() => onDelete(task.id)}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
