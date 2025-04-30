"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// import type
import { Item } from "@/types/Item";
import TaskItem from "@/components/shopping-list/ShoppingItem";

// import icons
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddItemModal from "@/components/shopping-list/AddItemModal";

const intialItems: Item[] = [
  { id: "1", text: "White Rice" },
  { id: "2", text: "Tomato Paste" },
  { id: "3", text: "Pasta" },
  { id: "4", text: "Chicken" },
  { id: "5", text: "Ground Beef" },
];

export default function Page() {
  const prompt =
    "Interpret this search (White Rice, tomato paste, peanut butter, pizza, container) and give me keywords to look up in Woolworths or Coles. Just give me the answer no need to explain like chicken: chicken -> ...";

  const [output, setOutput] = useState("This is a nextjs project");

  const generateText = async () => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ body: prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output || "No response received");
      } else {
        setOutput(data.error || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      setOutput("Failed to fetch response");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<Item[]>(intialItems);

  const handleDeleteItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, newText: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, text: newText } : item
      )
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddItem = (newItemText: string) => {
    if (newItemText.trim()) {
      const newItem: Item = {
        id: uuidv4(),
        text: newItemText.trim(),
      };
      setItems((prevItems) => [...prevItems, newItem]);
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
        {items.map((item) => (
          <TaskItem
            key={item.id}
            item={item}
            onDelete={handleDeleteItem}
            onUpdate={handleUpdateItem}
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
            onClick={generateText}
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
        <div className="mt-4 p-4 border rounded-lg">
          <h2 className="font-semibold mb-2">Gemini API Response:</h2>
          <p>{output}</p>
        </div>
      </div>
    </div>
  );
}
