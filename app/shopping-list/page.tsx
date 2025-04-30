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
import { OptimizedItem } from "@/types/OptimizedItem";

const initialItems: Item[] = [
  { id: "1", text: "White Rice" },
  { id: "2", text: "Tomato Paste" },
  { id: "3", text: "Pasta" },
  { id: "4", text: "Chicken" },
  { id: "5", text: "Sauce" },
];

export default function Page() {
  const prompt = `You are an assistant that helps optimize grocery search terms for Woolworths and Coles. Interpret the following JSON array of items and generate simplified and effective keywords for each item to search on Woolworths and Coles. Format the response as an array of objects with: id, wooliesKeyword, colesKeyword. Items: ${JSON.stringify(
    initialItems,
    null,
    2
  )}`;

  const [optimizedItems, setOptimizedItems] = useState<OptimizedItem[]>([]);

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
        try {
          const cleanedOutput = data.output
            ?.replace(/^```(?:json\n)?/, "") // Remove optional ```json\n at the beginning
            .replace(/```$/, "") // Remove ``` at the end
            .replace(/^json\s*/i, "") // Remove "json" (case-insensitive) and any following whitespace at the beginning
            .trim();
          const parsed: OptimizedItem[] = JSON.parse(cleanedOutput);

          setOptimizedItems(parsed);
        } catch (e) {
          console.error("Failed to parse optimized items", e);
          setOptimizedItems([]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<Item[]>(initialItems);

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
        {optimizedItems.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full text-sm text-left border border-gray-300 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b">Woolworths Keyword</th>
                  <th className="px-4 py-2 border-b">Coles Keyword</th>
                </tr>
              </thead>
              <tbody>
                {optimizedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">
                      {item.wooliesKeyword}
                    </td>
                    <td className="px-4 py-2 border-b">{item.colesKeyword}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
