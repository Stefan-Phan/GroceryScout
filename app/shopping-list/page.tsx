"use client";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// import type
import { Task } from "@/types/Task";
import TaskItem from "@/components/shopping-list/TaskItem";

// import icons
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddItemModal from "@/components/shopping-list/AddItemModal";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "White Rice" },
    { id: "2", text: "Tomato Paste" },
    { id: "3", text: "Pasta" },
    { id: "4", text: "Chicken" },
    { id: "5", text: "Ground Beef" },
  ]);

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleUpdateTask = (id: string, newText: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddItem = (newItemText: string) => {
    if (newItemText.trim()) {
      const newItem: Task = {
        id: uuidv4(),
        text: newItemText.trim(),
      };
      setTasks((preTasks) => [...preTasks, newItem]);
    }
    closeModal();
  };

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl text-center font-bold my-6">
          My Shopping List
        </h1>

        {/* Task rows */}
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        ))}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex gap-2 items-center text-white bg-gray-700 hover:bg-gray-900  font-medium rounded-lg text-sm px-6 py-2.5 cursor-pointer transition mb-6"
          >
            <PlusIcon className="h-6 w-6" strokeWidth={2} />
            ADD NEW ITEM
          </button>
          <button
            type="button"
            className="flex gap-2 items-center text-white bg-emerald-700 hover:bg-emerald-900  font-medium rounded-lg text-sm px-8 py-2.5 cursor-pointer transition mb-6"
          >
            <BanknotesIcon className="h-6 w-6" />
            GET DEALS
          </button>
        </div>

        {isModalOpen && (
          <AddItemModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onAddItem={handleAddItem}
          />
        )}
      </div>
    </div>
  );
}
