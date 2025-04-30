"use client";
import { useRef, useState } from "react";

// import type
import { Task } from "@/types/Task";
import TaskItem from "@/components/shopping-list/TaskItem";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "White Rice" },
    { id: "2", text: "Tomato Paste" },
    { id: "3", text: "Pasta" },
    { id: "4", text: "Chicken" },
  ]);

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen flex justify-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl text-center font-bold my-6">
          My Shopping List
        </h1>

        <button
          type="button"
          className="text-white bg-gray-700 hover:bg-gray-900 w-full focus:outline-none font-medium rounded-lg text-sm px-8 py-2.5 cursor-pointer transition mb-6"
        >
          ADD NEW ITEM
        </button>

        {/* Task rows */}
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onDelete={handleDeleteTask} />
        ))}
      </div>
    </div>
  );
}
